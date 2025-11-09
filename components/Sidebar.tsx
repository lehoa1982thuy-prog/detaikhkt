import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  volume: number;
  setVolume: (volume: number) => void;
}

interface NavItemProps {
  icon: string;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView.startsWith(view);
  return (
    <button
      onClick={() => onClick(view)}
      className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      <i className={`w-6 text-center ${icon}`}></i>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, volume, setVolume }) => {
  const menuItems = {
    dashboard: [
      { icon: 'fas fa-home', label: 'Tổng quan', view: 'dashboard' as View },
    ],
    subjects: [
      { icon: 'fas fa-calculator', label: 'Toán học', view: 'math' as View },
      { icon: 'fas fa-feather', label: 'Ngữ văn', view: 'literature' as View },
      { icon: 'fas fa-book-open', label: 'Tiếng Anh', view: 'english' as View },
      { icon: 'fas fa-code', label: 'Tin học', view: 'it' as View },
    ],
    tools: [
      { icon: 'fas fa-robot', label: 'Chat với AI', view: 'chat' as View },
      { icon: 'fas fa-clone', label: 'Flashcards', view: 'flashcards' as View },
      { icon: 'fas fa-tasks', label: 'Kế hoạch', view: 'planner' as View },
      { icon: 'fas fa-clock', label: 'Pomodoro', view: 'pomodoro' as View },
    ],
  };

  const getVolumeIcon = () => {
    if (volume === 0) return 'fas fa-volume-mute';
    if (volume < 0.5) return 'fas fa-volume-down';
    return 'fas fa-volume-up';
  };

  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 z-30 w-80 bg-white dark:bg-slate-800 p-6 shadow-lg flex-col flex transition-transform duration-300 ease-in-out ${ isOpen ? 'translate-x-0' : '-translate-x-full' } lg:translate-x-0`}>
      <nav className="flex flex-col gap-8 flex-1">
        <div>
          <h2 className="px-4 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Dashboard</h2>
          <div className="flex flex-col gap-2">
            {menuItems.dashboard.map(item => (
              <NavItem key={item.view} {...item} currentView={currentView} onClick={setCurrentView} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="px-4 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Môn học</h2>
          <div className="flex flex-col gap-2">
            {menuItems.subjects.map(item => (
              <NavItem key={item.view} {...item} currentView={currentView} onClick={setCurrentView} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="px-4 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Công cụ học tập</h2>
          <div className="flex flex-col gap-2">
            {menuItems.tools.map(item => (
              <NavItem key={item.view} {...item} currentView={currentView} onClick={setCurrentView} />
            ))}
          </div>
        </div>
      </nav>
      
      <div className="mt-auto">
        <h2 className="px-4 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">Hiệu ứng</h2>
        <div className="flex items-center gap-3 px-4 py-3">
          <i className={`w-6 text-center text-slate-600 dark:text-slate-300 ${getVolumeIcon()}`}></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            aria-label="Volume control"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;