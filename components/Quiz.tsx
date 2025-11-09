

import React, { useState } from 'react';

type AnswerState = 'unselected' | 'selected' | 'correct' | 'incorrect';

const Quiz: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const correctAnswer = 'B';

  const answers = [
    { id: 'A', text: 'Vật sẽ chuyển động chậm dần đều.' },
    { id: 'B', text: 'Vật sẽ chuyển động thẳng đều.' },
    { id: 'C', text: 'Vật sẽ chuyển động nhanh dần đều.' },
    { id: 'D', text: 'Vật sẽ đứng yên.' },
  ];

  const handleSelectAnswer = (id: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(id);
    }
  };
  
  const handleSubmit = () => {
      if(selectedAnswer) {
          setIsSubmitted(true);
      }
  }

  const getAnswerState = (id: string): AnswerState => {
    if (!isSubmitted) {
      return selectedAnswer === id ? 'selected' : 'unselected';
    }
    if (id === correctAnswer) {
      return 'correct';
    }
    if (id === selectedAnswer && id !== correctAnswer) {
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
      <h2 className="text-3xl font-bold text-center mb-2">Bài kiểm tra Vật Lý</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Câu 1/10</p>
      
      <p className="text-xl text-slate-800 dark:text-slate-100 mb-8">
        Theo định luật I Newton, nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không, thì vật đó sẽ như thế nào?
      </p>

      <div className="space-y-4">
        {answers.map(({ id, text }) => (
          <button
            key={id}
            onClick={() => handleSelectAnswer(id)}
            className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 ${getButtonClass(getAnswerState(id))}`}
          >
            <span className="font-bold mr-4">{id}.</span>
            <span>{text}</span>
          </button>
        ))}
      </div>
      
      {!isSubmitted && (
         <button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer}
            className="mt-8 w-full py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
            Trả lời
        </button>
      )}

      {isSubmitted && (
        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Giải thích chi tiết</h3>
          <p className="text-slate-700 dark:text-slate-200">
            Định luật I Newton (Định luật quán tính) phát biểu rằng: "Một vật sẽ giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều nếu không có lực nào tác dụng lên nó, hoặc nếu các lực tác dụng lên nó cân bằng nhau." Do đó, đáp án đúng là B.
          </p>
        </div>
      )}
    </div>
  );
};

export default Quiz;