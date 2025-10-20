import React, { useState, useEffect, useRef } from 'react';
// FIX: Import Chat and GoogleGenAI for Gemini API functionality.
import { GoogleGenAI, Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface QuickChatProps {
    closeChat: () => void;
}

const QuickChat: React.FC<QuickChatProps> = ({ closeChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Initialize the GoogleGenAI client and create a chat session.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a friendly and helpful AI study assistant. Your goal is to help students with quick questions. Keep your answers concise.',
      },
    });
    setChat(chatSession);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      // FIX: Access the generated text directly from the response object.
      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-8 z-30 w-[calc(100vw-4rem)] max-w-sm h-[60vh] max-h-[500px] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-transform transform-gpu">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="font-bold text-lg">Quick Chat</h3>
            <button onClick={closeChat} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                <i className="fas fa-times"></i>
            </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-robot text-sm"></i>
                </div>
                )}
                <div className={`max-w-xs p-3 rounded-xl whitespace-pre-wrap ${
                msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}>
                <p className="text-sm">{msg.text}</p>
                </div>
            </div>
            ))}
            {isLoading && (
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-robot text-sm"></i>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a quick question..."
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 flex-shrink-0 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                <i className="fas fa-paper-plane"></i>
            </button>
            </div>
      </div>
    </div>
  );
};

export default QuickChat;
