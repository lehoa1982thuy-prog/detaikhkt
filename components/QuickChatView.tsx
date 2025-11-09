
import React from 'react';
import QuickChat from './QuickChat';

interface QuickChatViewProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    initialMessage: string;
    clearInitialMessage: () => void;
}

const QuickChatView: React.FC<QuickChatViewProps> = ({ isOpen, setIsOpen, initialMessage, clearInitialMessage }) => {
    return (
        <>
            <div className="fixed bottom-8 right-4 sm:right-8 z-40">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform transform-gpu"
                    aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
                >
                    <i className={`fas transition-transform duration-300 ${isOpen ? 'fa-times rotate-90' : 'fa-comment-dots'}`}></i>
                </button>
            </div>
            {isOpen && <QuickChat 
                closeChat={() => setIsOpen(false)} 
                initialMessage={initialMessage}
                clearInitialMessage={clearInitialMessage}
            />}
        </>
    );
};

export default QuickChatView;