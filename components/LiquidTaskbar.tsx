import React from 'react';
import type { View } from '../types';

interface TaskbarItemProps {
  icon: string;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}

const TaskbarItem: React.FC<TaskbarItemProps> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView.startsWith(view);
  return (
    <div className="relative group flex flex-col items-center">
      <button
        onClick={() => onClick(view)}
        className={`w-14 h-14 flex items-center justify-center rounded-full text-2xl transition-all duration-300 transform-gpu
          ${isActive
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110'
            : 'text-slate-600 dark:text-slate-200 bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:scale-110'
          }`}
        aria-label={label}
      >
        <i className={icon}></i>
      </button>
      <div className="absolute bottom-full mb-2 px-3 py-1.5 text-sm font-semibold text-white bg-slate-800/80 dark:bg-slate-900/80 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {label}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-slate-800/80 dark:bg-slate-900/80 rotate-45"></div>
      </div>
    </div>
  );
};

interface LiquidTaskbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const LiquidTaskbar: React.FC<LiquidTaskbarProps> = ({ currentView, setCurrentView }) => {
  const taskbarItems = [
    { icon: 'fas fa-home', label: 'Tổng quan', view: 'dashboard' as View },
    { icon: 'fas fa-robot', label: 'Chat với AI', view: 'chat' as View },
    { icon: 'fas fa-tasks', label: 'Kế hoạch', view: 'planner' as View },
    { icon: 'fas fa-clock', label: 'Pomodoro', view: 'pomodoro' as View },
    { icon: 'fas fa-clone', label: 'Flashcards', view: 'flashcards' as View },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 p-2 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg rounded-full shadow-2xl border border-white/20 dark:border-slate-700/20">
        {taskbarItems.map(item => (
          <TaskbarItem key={item.view} {...item} currentView={currentView} onClick={setCurrentView} />
        ))}
      </div>
    </nav>
  );
};

export default LiquidTaskbar;