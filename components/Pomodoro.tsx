
import React, { useState, useEffect, useCallback } from 'react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODE_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES[mode]);
  const [isActive, setIsActive] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[mode]);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);
  
  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to a browser-compatible type for setInterval's return value.
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Here you could add auto-switching modes and notifications
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const progress = ((MODE_TIMES[mode] - timeLeft) / MODE_TIMES[mode]) * 100;
  
  const getModeButtonClass = (buttonMode: TimerMode) => {
      return mode === buttonMode 
        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
        : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600';
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex gap-2 mb-8 p-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
        <button onClick={() => setMode('work')} className={`px-4 py-2 rounded-full font-semibold transition-colors ${getModeButtonClass('work')}`}>Làm việc</button>
        <button onClick={() => setMode('shortBreak')} className={`px-4 py-2 rounded-full font-semibold transition-colors ${getModeButtonClass('shortBreak')}`}>Nghỉ ngắn</button>
        <button onClick={() => setMode('longBreak')} className={`px-4 py-2 rounded-full font-semibold transition-colors ${getModeButtonClass('longBreak')}`}>Nghỉ dài</button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-700"/>
            <circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="12"
                className="stroke-indigo-500"
                strokeDasharray="339.292"
                strokeDashoffset={339.292 - (progress / 100) * 339.292}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
        </svg>
        <span className="text-6xl font-bold z-10 text-slate-800 dark:text-slate-100">{formatTime(timeLeft)}</span>
      </div>

      <div className="flex gap-4">
        <button onClick={toggleTimer} className="w-40 py-3 text-xl font-bold text-white rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity">
          {isActive ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button onClick={resetTimer} className="w-20 py-3 text-xl font-bold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <i className="fas fa-redo"></i>
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;