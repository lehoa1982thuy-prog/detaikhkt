import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
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
}

interface MathQuizProps {
    onAskAi: (question: string) => void;
}

const questions: Question[] = [
  {
    questionText: "Hàm số y = (1 - 2x) / (-x + 2) có bao nhiêu điểm cực trị?",
    answers: [
      { id: 'A', text: '3' },
      { id: 'B', text: '1' },
      { id: 'C', text: '2' },
      { id: 'D', text: '0' },
    ],
    correctAnswer: 'D',
  },
  {
    questionText: "Trong không gian Oxyz, toạ độ hình chiếu của điểm A(1; 2; −3) lên mặt phẳng (Oxy) là gì?",
    answers: [
      { id: 'A', text: '(0; 2; -3)' },
      { id: 'B', text: '(1; 0; -3)' },
      { id: 'C', text: '(1; 2; 0)' },
      { id: 'D', text: '(1; 0; 0)' },
    ],
    correctAnswer: 'C',
  },
  {
    questionText: "Giá trị nhỏ nhất của hàm số y = (x - 1) / (x + 1) trên đoạn [0; 3] là bao nhiêu?",
    answers: [
      { id: 'A', text: '-3' },
      { id: 'B', text: '1/2' },
      { id: 'C', text: '-1' },
      { id: 'D', text: '1' },
    ],
    correctAnswer: 'C',
  },
];

const MathQuiz: React.FC<MathQuizProps> = ({ onAskAi }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const fetchExplanation = async () => {
    setIsExplanationLoading(true);
    setAiExplanation('');
    try {
        if (!process.env.API_KEY) {
          throw new Error("API key is not provided.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Giải thích chi tiết tại sao đáp án đúng cho câu hỏi trắc nghiệm Toán học sau đây lại là đáp án đó. Trình bày một cách dễ hiểu cho học sinh cấp 3.
        
        Câu hỏi: "${currentQuestion.questionText}"
        
        Các lựa chọn:
        ${currentQuestion.answers.map(a => `${a.id}. ${a.text}`).join('\n')}
        
        Đáp án đúng: ${currentQuestion.correctAnswer}
        
        Bắt đầu giải thích:`;

        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });

        setAiExplanation(response.text);
    } catch (error) {
        if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("provide an API key"))) {
            setAiExplanation("Không thể tải giải thích từ AI. Vui lòng kiểm tra API key của bạn trong tệp .env và làm mới trang.");
        } else {
            console.error("Error fetching AI explanation:", error);
            setAiExplanation("Rất tiếc, đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại.");
        }
    } finally {
        setIsExplanationLoading(false);
    }
  };

  const handleSelectAnswer = (id: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(id);
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer) {
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScore(prevScore => prevScore + 1);
      }
      setIsSubmitted(true);
      if (selectedAnswer !== currentQuestion.correctAnswer) {
        fetchExplanation();
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
    setIsSubmitted(false);
    setSelectedAnswer(null);
    setAiExplanation('');
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setAiExplanation('');
    setScore(0);
    setIsFinished(false);
  };

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

  if (isFinished) {
    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Hoàn thành!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Bạn đã hoàn thành bài kiểm tra Toán học.</p>
            <p className="text-2xl font-bold mb-8">Điểm của bạn: <span className="text-indigo-500">{score} / {questions.length}</span></p>
            <button
                onClick={restartQuiz}
                className="px-8 py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity"
            >
                Làm lại
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-2">Bài kiểm tra Toán học</h2>
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

      {isSubmitted && selectedAnswer !== currentQuestion.correctAnswer && (
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Không chính xác!</h3>
            {isExplanationLoading ? (
                 <div className="flex items-center gap-2">
                    <p className="text-slate-700 dark:text-slate-200">AI đang giải thích...</p>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
             ) : (
                 <>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Giải thích từ AI:</h4>
                    <MathRenderer text={aiExplanation} className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap mt-2" />
                 </>
             )
            }
        </div>
      )}
       {isSubmitted && selectedAnswer === currentQuestion.correctAnswer && (
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/50 rounded-xl">
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Chính xác! Làm tốt lắm!</h3>
        </div>
      )}
    </div>
  );
};

export default MathQuiz;