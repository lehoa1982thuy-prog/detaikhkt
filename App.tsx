import React, { useState, useEffect } from 'react';
import type { View, Theme, AppData, Subject, Todo, Flashcard } from './types';
import { loadAppData, saveAppData } from './services/database';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AiChat from './components/AiChat';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';
import SubjectView from './components/SubjectView';
import TheoryView from './components/TheoryView';
import Flashcards from './components/Flashcards';
import QuickChatView from './components/QuickChatView';
import AiQuiz from './components/AiQuiz';
import LiquidTaskbar from './components/LiquidTaskbar';
import CursorFollower from './components/CursorFollower';
import Snowfall from './components/Snowfall';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [appData, setAppData] = useState<AppData>(loadAppData());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [quickChatInitialMessage, setQuickChatInitialMessage] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleUpdateTodos = (todos: Todo[]) => {
    setAppData(prev => ({ ...prev, todos }));
  };

  const handleUpdateFlashcards = (flashcards: Flashcard[]) => {
    setAppData(prev => ({ ...prev, flashcards }));
  };

  const handleAskAi = (question: string) => {
    setQuickChatInitialMessage(question);
    setIsQuickChatOpen(true);
  };

  const clearInitialMessage = () => {
    setQuickChatInitialMessage('');
  };

  const handleSetCurrentView = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation on mobile
  };

  const renderView = () => {
    const viewParts = currentView.split('-');
    const subject = viewParts[0] as Subject;
    const subView = viewParts[1];

    if (subView === 'quiz') {
      return <AiQuiz subject={subject} onAskAi={handleAskAi} />;
    }
    
    if (subView === 'theory') {
      return <TheoryView subject={subject} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard progress={appData.progress} setCurrentView={handleSetCurrentView} />;
      case 'chat':
        return <AiChat />;
      case 'planner':
        return <Planner todos={appData.todos} onUpdateTodos={handleUpdateTodos} />;
      case 'pomodoro':
        return <Pomodoro />;
      case 'flashcards':
        return <Flashcards flashcards={appData.flashcards} onUpdateFlashcards={handleUpdateFlashcards} />;
      case 'math':
      case 'literature':
      case 'english':
      case 'it':
        return <SubjectView subject={currentView} setCurrentView={handleSetCurrentView} />;
      default:
        // Fallback for any invalid view
        return <Dashboard progress={appData.progress} setCurrentView={handleSetCurrentView} />;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans`}>
      <CursorFollower />
      <Snowfall />
      <Sidebar
        currentView={currentView}
        setCurrentView={handleSetCurrentView}
        isOpen={isSidebarOpen}
        volume={volume}
        setVolume={setVolume}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {renderView()}
        </main>
      </div>
      
      <div className="lg:hidden">
        <LiquidTaskbar currentView={currentView} setCurrentView={handleSetCurrentView} />
      </div>

      <QuickChatView
        isOpen={isQuickChatOpen}
        setIsOpen={setIsQuickChatOpen}
        initialMessage={quickChatInitialMessage}
        clearInitialMessage={clearInitialMessage}
      />
    </div>
  );
};

export default App;