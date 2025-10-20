import React, { useState } from 'react';
import QuickChat from './QuickChat';

const QuickChatView: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-8 right-8 z-40">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform transform-gpu"
                    aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
                >
                    <i className={`fas transition-transform duration-300 ${isOpen ? 'fa-times rotate-90' : 'fa-comment-dots'}`}></i>
                </button>
            </div>
            {isOpen && <QuickChat closeChat={() => setIsOpen(false)} />}
        </>
    );
};

export default QuickChatView;
