import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import ApiKeyPrompt from './ApiKeyPrompt';
import type { Subject } from '../types';
import { subjectDetails } from '../types';
import MathRenderer from './MathRenderer';

type AnswerState = 'unselected' | 'selected' | 'correct' | 'incorrect';

interface Answer {
  id: string;
  text: string;
}

interface Question {
  questionText: string;
  answers: Answer[];
  correctAnswer: string;
  explanation: string;
}

interface AiQuizProps {
    subject: Subject;
    onAskAi: (question: string) => void;
}

type QuizState = 'idle' | 'generating' | 'playing' | 'finished';

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of 5 multiple choice questions for a high school student.",
            items: {
                type: Type.OBJECT,
                properties: {
                    questionText: { type: Type.STRING, description: "The question text, in Vietnamese." },
                    answers: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "A, B, C, or D." },
                                text: { type: Type.STRING, description: "The answer text, in Vietnamese." },
                            },
                            required: ['id', 'text']
                        }
                    },
                    correctAnswer: { type: Type.STRING, description: "The ID of the correct answer (A, B, C, or D)." },
                    explanation: { type: Type.STRING, description: "A detailed explanation for the correct answer, in Vietnamese." },
                },
                required: ['questionText', 'answers', 'correctAnswer', 'explanation']
            }
        }
    },
    required: ['questions']
};


const AiQuiz: React.FC<AiQuizProps> = ({ subject, onAskAi }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);
  
  const details = subjectDetails[subject];

  useEffect(() => {
    // Reset state when subject changes
    setQuizState('idle');
    setQuestions([]);
    setError(null);
    setCustomTopic('');
    setScore(0);
  }, [subject]);

  useEffect(() => {
    const checkKey = async () => {
      setIsCheckingApiKey(true);
       if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
      setIsCheckingApiKey(false);
    };
    checkKey();
  }, []);

  const selectApiKey = async () => {
     if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const generateQuiz = async () => {
    if (!hasApiKey) return;
    setQuizState('generating');
    setError(null);
    setScore(0);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = customTopic.trim()
            ? `Hãy tạo 5 câu hỏi trắc nghiệm môn ${details.name} cấp trung học phổ thông bằng tiếng Việt về chủ đề: "${customTopic}".`
            : `Hãy tạo 5 câu hỏi trắc nghiệm môn ${details.name} cấp trung học phổ thông bằng tiếng Việt.`;
            
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        
        const quizData = JSON.parse(response.text);
        if (quizData.questions && quizData.questions.length > 0) {
            setQuestions(quizData.questions);
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setIsSubmitted(false);
            setQuizState('playing');
        } else {
            throw new Error("AI did not return any questions.");
        }
    } catch (err) {
        console.error("Error generating quiz:", err);
        if (err instanceof Error && err.message.includes("Requested entity was not found")) {
            setHasApiKey(false);
            setError("Your API key appears to be invalid. Please select a valid key to generate a quiz.");
        } else {
            setError("Không thể tạo bài kiểm tra. Vui lòng thử lại.");
        }
        setQuizState('idle');
    }
  };

  if (isCheckingApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="text-xl font-semibold">Checking for API Key...</div>
      </div>
    );
  }

  if (!hasApiKey) {
      return <ApiKeyPrompt onSelectApiKey={selectApiKey} featureName={`AI-Generated ${details.name} Quizzes`} />
  }

  if (quizState === 'idle' || quizState === 'generating') {
    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Bài kiểm tra {details.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Thử thách kiến thức của bạn với một bài kiểm tra được tạo bởi AI!</p>
            
            <div className="max-w-lg mx-auto">
                <label htmlFor="topic-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Nhập một chủ đề cụ thể (tùy chọn):
                </label>
                <input
                    id="topic-input"
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder={`Ví dụ: ${details.topics[0]}`}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
                    disabled={quizState === 'generating'}
                />
            </div>

            <button
                onClick={generateQuiz}
                disabled={quizState === 'generating'}
                className="w-full sm:w-auto px-8 py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-50 disabled:cursor-wait hover:opacity-90 transition-opacity"
            >
                {quizState === 'generating' ? 'Đang tạo...' : 'Tạo bài kiểm tra'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (id: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(id);
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer) {
      if(selectedAnswer === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1);
      }
      setIsSubmitted(true);
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setSelectedAnswer(null);
    } else {
      setQuizState('finished');
    }
  }

  if (quizState === 'finished') {
      return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Bạn đã hoàn thành bài kiểm tra {details.name} do AI tạo ra.</p>
            <p className="text-2xl font-bold mb-8">Điểm của bạn: <span className="text-indigo-500">{score} / {questions.length}</span></p>
            <button
                onClick={() => setQuizState('idle')}
                className="px-8 py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity"
            >
                Tạo bài kiểm tra khác
            </button>
        </div>
      )
  }

  const getAnswerState = (id: string): AnswerState => {
    if (!isSubmitted) {
      return selectedAnswer === id ? 'selected' : 'unselected';
    }
    if (id === currentQuestion.correctAnswer) {
      return 'correct';
    }
    if (id === selectedAnswer && id !== currentQuestion.correctAnswer) {
      return 'incorrect';
    }
    return 'unselected';
  };

  const getButtonClass = (state: AnswerState) => {
    switch(state) {
      case 'selected':
        return 'bg-indigo-200 dark:bg-indigo-800 border-indigo-500 ring-2 ring-indigo-500';
      case 'correct':
        return 'bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200';
      case 'incorrect':
        return 'bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200';
      case 'unselected':
      default:
        return 'bg-slate-100 dark:bg-slate-700 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600';
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-2">Bài kiểm tra {details.name}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{`Câu ${currentQuestionIndex + 1}/${questions.length}`}</p>
      
      <p className="text-xl text-slate-800 dark:text-slate-100 mb-8">
        {currentQuestion.questionText}
      </p>

      <div className="space-y-4">
        {currentQuestion.answers.map(({ id, text }) => (
          <button
            key={id}
            onClick={() => handleSelectAnswer(id)}
            disabled={isSubmitted}
            className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 ${getButtonClass(getAnswerState(id))}`}
          >
            <span className="font-bold mr-4">{id}.</span>
            <span>{text}</span>
          </button>
        ))}
      </div>
      
      {!isSubmitted ? (
         <button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="mt-8 w-full py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
            Trả lời
        </button>
      ) : (
        <button 
            onClick={handleNext} 
            className="mt-8 w-full py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity">
            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
        </button>
      )}
      
      {!isSubmitted && (
          <div className="text-center mt-4">
            <button
                onClick={() => onAskAi(currentQuestion.questionText)}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                <i className="fas fa-comment-dots mr-1"></i>
                Cần trợ giúp? Hỏi AI
            </button>
        </div>
      )}

      {isSubmitted && (
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <h3 className={`text-xl font-bold mb-2 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {selectedAnswer === currentQuestion.correctAnswer ? 'Chính xác!' : 'Không chính xác!'}
          </h3>
          <MathRenderer text={currentQuestion.explanation} className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap" />
        </div>
      )}
    </div>
  );
};

export default AiQuiz;