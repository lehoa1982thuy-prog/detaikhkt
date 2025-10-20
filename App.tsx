import React, { useState, useEffect, useMemo } from 'react';
import type { View, Theme, AppData, Subject, Todo, Flashcard } from './types';
import { loadAppData, saveAppData } from './services/database';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AiChat from './components/AiChat';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';
import Flashcards from './components/Flashcards';
import SubjectView from './components/SubjectView';
import TheoryView from './components/TheoryView';
import MathQuiz from './components/MathQuiz';
import LiteratureQuiz from './components/LiteratureQuiz';
import EnglishQuiz from './components/EnglishQuiz';
import ITQuiz from './components/ITQuiz';
import QuickChatView from './components/QuickChatView';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [appData, setAppData] = useState<AppData>(loadAppData);

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
    setAppData(prevData => ({ ...prevData, todos }));
  };

  const handleUpdateFlashcards = (flashcards: Flashcard[]) => {
    setAppData(prevData => ({ ...prevData, flashcards }));
  };

  const currentSubject = useMemo(() => {
    if (currentView.includes('-')) {
        return currentView.split('-')[0] as Subject;
    }
    const subjects: Subject[] = ['math', 'literature', 'english', 'it'];
    if (subjects.includes(currentView as Subject)) {
        return currentView as Subject;
    }
    return null;
  }, [currentView]);

  const renderContent = () => {
    if (currentView.endsWith('-quiz')) {
        switch(currentSubject) {
            case 'math': return <MathQuiz />;
            case 'literature': return <LiteratureQuiz />;
            case 'english': return <EnglishQuiz />;
            case 'it': return <ITQuiz />;
            default: return <div>Quiz not found for subject: {currentSubject}</div>;
        }
    }

    if (currentView.endsWith('-theory')) {
        if (currentSubject) {
            return <TheoryView subject={currentSubject} />;
        }
    }
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard progress={appData.progress} />;
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
        return <SubjectView subject={currentView} setCurrentView={setCurrentView} />;
      default:
        return <Dashboard progress={appData.progress} />;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans`}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      <QuickChatView />
    </div>
  );
};

export default App;