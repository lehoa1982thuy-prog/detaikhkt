
import React from 'react';
import type { Subject, View } from '../types';
import { subjectDetails } from '../types';

interface SubjectViewProps {
  subject: Subject;
  setCurrentView: (view: View) => void;
}

const OptionCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full text-left flex flex-col items-center text-center"
    >
        <div className="text-5xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
            <i className={icon}></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </button>
);

const SubjectView: React.FC<SubjectViewProps> = ({ subject, setCurrentView }) => {
  const details = subjectDetails[subject];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          <span className={`bg-gradient-to-r ${details.gradient} bg-clip-text text-transparent`}>
            Chào mừng đến với môn {details.name}!
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Chọn một hoạt động bên dưới để bắt đầu học tập.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OptionCard 
            icon="fas fa-book" 
            title="Học lý thuyết" 
            description="Ôn tập lại các khái niệm, định luật và kiến thức cốt lõi của môn học."
            onClick={() => setCurrentView(`${subject}-theory`)}
        />
        <OptionCard 
            icon="fas fa-file-lines" 
            title="Làm bài kiểm tra" 
            description="Thử thách bản thân với các câu hỏi trắc nghiệm để củng cố kiến thức."
            onClick={() => setCurrentView(`${subject}-quiz`)}
        />
      </div>
    </div>
  );
};

export default SubjectView;