
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
    questionText: "Tác phẩm 'Truyện Kiều' là của tác giả nào?",
    answers: [
      { id: 'A', text: 'Hồ Xuân Hương' },
      { id: 'B', text: 'Nguyễn Du' },
      { id: 'C', text: 'Nguyễn Trãi' },
      { id: 'D', text: 'Bà Huyện Thanh Quan' },
    ],
    correctAnswer: 'B',
    explanation: "Truyện Kiều, hay còn gọi là Đoạn trường tân thanh, là một truyện thơ của đại thi hào Nguyễn Du, được xem là kiệt tác của văn học Việt Nam."
  },
  {
    questionText: "Nhân vật chính trong tác phẩm 'Tắt đèn' của Ngô Tất Tố là ai?",
    answers: [
      { id: 'A', text: 'Chí Phèo' },
      { id: 'B', text: 'Lão Hạc' },
      { id: 'C', text: 'Chị Dậu' },
      { id: 'D', text: 'A Phủ' },
    ],
    correctAnswer: 'C',
    explanation: "Chị Dậu là nhân vật chính trong tác phẩm 'Tắt đèn', hình ảnh tiêu biểu cho người phụ nữ nông dân Việt Nam trước Cách mạng tháng Tám, với những phẩm chất tốt đẹp nhưng phải chịu nhiều đau khổ, áp bức."
  },
];


const LiteratureQuiz: React.FC = () => {
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
      // End of quiz
      alert("Bạn đã hoàn thành bài kiểm tra Ngữ Văn!");
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
      <h2 className="text-3xl font-bold text-center mb-2">Bài kiểm tra Ngữ Văn</h2>
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

export default LiteratureQuiz;