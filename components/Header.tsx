
import React from 'react';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm h-20">
      <div className="flex items-center gap-3">
        <div className="text-2xl text-white p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
            <i className="fas fa-graduation-cap"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">AI Study Assistant</h1>
      </div>
      <button
        onClick={toggleTheme}
        className="h-10 w-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
      </button>
    </header>
  );
};

export default Header;
