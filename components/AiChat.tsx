import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import MathRenderer from './MathRenderer';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
          throw new Error("API key is not provided.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a friendly and helpful AI study assistant. Your goal is to help students understand topics, prepare for exams, and manage their studies effectively. Provide clear, concise, and encouraging answers.',
        },
      });
      setChat(chatSession);
    } catch (error) {
        console.error("Failed to initialize AI Chat:", error);
        setMessages([{ role: 'model', text: 'Không thể khởi tạo AI Chat. Vui lòng kiểm tra API key của bạn trong tệp .env và làm mới trang.' }]);
    }
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: currentInput });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        modelResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }

    } catch (error) {
       setMessages(prev => prev.filter((_, i) => i < prev.length -1)); // remove placeholder on error
       if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("provide an API key"))) {
        const errorMessage: Message = { role: 'model', text: 'API key của bạn không hợp lệ. Vui lòng kiểm tra tệp .env và làm mới trang.' };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        console.error('Error sending message:', error);
        const errorMessage: Message = { role: 'model', text: 'Rất tiếc, tôi đã gặp lỗi. Vui lòng thử lại.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold">Chat với AI</h2>
        <p className="text-slate-500 dark:text-slate-400">Hỏi bất cứ điều gì để được trợ giúp học tập!</p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                <i className="fas fa-robot"></i>
              </div>
            )}
            <div className={`max-w-xl p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
            }`}>
              <MathRenderer text={msg.text} className="whitespace-pre-wrap" />
              {index === messages.length - 1 && msg.role === 'model' && isLoading && (
                  <span className="inline-block w-2.5 h-5 bg-slate-700 dark:bg-slate-200 animate-pulse ml-1 translate-y-1"></span>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                <i className="fas fa-robot"></i>
              </div>
            <div className="max-w-lg p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;