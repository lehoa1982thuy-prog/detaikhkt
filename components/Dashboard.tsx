import React from 'react';
import type { Subject, SubjectProgress, View } from '../types';

interface DashboardProps {
  progress: SubjectProgress;
  setCurrentView: (view: View) => void;
}

const StatCard: React.FC<{ icon: string; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md flex items-center gap-6 transition-transform hover:scale-105">
    <div className={`text-3xl p-4 rounded-full ${color}`}>
      <i className={icon}></i>
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const SubjectCard: React.FC<{ name: string; progress: number; gradient: string; onClick: () => void }> = ({ name, progress, gradient, onClick }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md flex flex-col justify-between transition-shadow hover:shadow-xl">
    <div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{name}</h3>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
            <div className={`bg-gradient-to-r ${gradient} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{progress}% Hoàn thành</p>
    </div>
    <button onClick={onClick} className={`w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}>
      Học tiếp
    </button>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ progress, setCurrentView }) => {

  const subjects: { name: string; progress: number; gradient: string; view: Subject }[] = [
      { name: "Toán học", progress: progress.math, gradient: "from-blue-500 to-cyan-500", view: 'math' },
      { name: "Ngữ văn", progress: progress.literature, gradient: "from-purple-500 to-pink-500", view: 'literature' },
      { name: "Tiếng Anh", progress: progress.english, gradient: "from-green-500 to-lime-500", view: 'english' },
      { name: "Tin học", progress: progress.it, gradient: "from-orange-500 to-amber-500", view: 'it' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Chào mừng trở lại!</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Hãy bắt đầu ngày học hôm nay thật hiệu quả nhé.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="fas fa-check-double" title="Câu hỏi đã làm" value="1,250" color="bg-blue-100 dark:bg-blue-900 text-blue-500" />
        <StatCard icon="fas fa-bullseye" title="Độ chính xác" value="85.7%" color="bg-green-100 dark:bg-green-900 text-green-500" />
        <StatCard icon="fas fa-fire" title="Ngày học liên tiếp" value="23" color="bg-orange-100 dark:bg-orange-900 text-orange-500" />
        <StatCard icon="fas fa-hourglass-half" title="Tổng giờ học" value="120" color="bg-purple-100 dark:bg-purple-900 text-purple-500" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Môn học của bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {subjects.map(subject => (
            <SubjectCard 
                key={subject.view}
                name={subject.name} 
                progress={subject.progress} 
                gradient={subject.gradient} 
                onClick={() => setCurrentView(subject.view)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;