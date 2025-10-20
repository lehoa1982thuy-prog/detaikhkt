import React, { useState } from 'react';

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

const questions: Question[] = [
  {
    questionText: "Trong một tam giác vuông, bình phương cạnh huyền bằng gì?",
    answers: [
      { id: 'A', text: 'Tổng bình phương hai cạnh góc vuông.' },
      { id: 'B', text: 'Hiệu bình phương hai cạnh góc vuông.' },
      { id: 'C', text: 'Tích hai cạnh góc vuông.' },
      { id: 'D', text: 'Thương hai cạnh góc vuông.' },
    ],
    correctAnswer: 'A',
    explanation: "Đây là nội dung của Định lý Pythagoras: trong một tam giác vuông, bình phương của cạnh huyền bằng tổng các bình phương của hai cạnh góc vuông."
  },
  {
    questionText: "Phương trình x² - 5x + 6 = 0 có hai nghiệm là?",
    answers: [
      { id: 'A', text: 'x=1 và x=6' },
      { id: 'B', text: 'x=-2 và x=-3' },
      { id: 'C', text: 'x=2 và x=3' },
      { id: 'D', text: 'x=-1 và x=-6' },
    ],
    correctAnswer: 'C',
    explanation: "Phương trình có a=1, b=-5, c=6. Ta có a+b+c = 1-5+6=2 (khác 0). Delta = b²-4ac = (-5)²-4*1*6 = 25-24=1. Do đó, hai nghiệm là x1=(5+1)/2=3 và x2=(5-1)/2=2."
  },
];


const MathQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (id: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(id);
    }
  };
  
  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setSelectedAnswer(null);
    } else {
      alert("Bạn đã hoàn thành bài kiểm tra Toán!");
    }
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

      {isSubmitted && (
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <h3 className={`text-xl font-bold mb-2 ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {selectedAnswer === currentQuestion.correctAnswer ? 'Chính xác!' : 'Không chính xác!'}
          </h3>
          <p className="text-slate-700 dark:text-slate-200">
            {currentQuestion.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default MathQuiz;
