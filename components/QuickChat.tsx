import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import ApiKeyPrompt from './ApiKeyPrompt';
import MathRenderer from './MathRenderer';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface QuickChatProps {
    closeChat: () => void;
    initialMessage: string;
    clearInitialMessage: () => void;
}

const QuickChat: React.FC<QuickChatProps> = ({ closeChat, initialMessage, clearInitialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

  useEffect(() => {
    if (initialMessage) {
        setInput(`Tôi có câu hỏi này: "${initialMessage}" \n\n Bạn có thể giải thích giúp tôi được không?`);
        clearInitialMessage();
    }
  }, [initialMessage, clearInitialMessage]);

  useEffect(() => {
    const checkKey = async () => {
      setIsCheckingApiKey(true);
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
      setIsCheckingApiKey(false);
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (hasApiKey) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a friendly and helpful AI study assistant. Your goal is to help students with quick questions. Keep your answers concise and clear. The user may paste in a question they are stuck on.',
        },
      });
      setChat(chatSession);
    } else {
        setChat(null);
    }
  }, [hasApiKey]);

   const selectApiKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

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
       if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
        const errorMessage: Message = { role: 'model', text: 'Invalid API key. Please select a valid key.' };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        console.error('Error sending message:', error);
        const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error.' };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
      if (isCheckingApiKey) {
          return (
              <div className="flex items-center justify-center h-full p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Checking for API Key...</p>
              </div>
          );
      }

      if (!hasApiKey) {
          return (
            <div className="flex-1 overflow-y-auto p-4">
                 <ApiKeyPrompt onSelectApiKey={selectApiKey} featureName="Quick Chat" />
            </div>
          )
      }
      
      return (
        <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
                {messages.length === 0 && !isLoading && (
                  <div className="text-center text-slate-400 m-auto">
                      <div className="text-4xl mb-2"><i className="fas fa-lightbulb"></i></div>
                      <p>Hỏi tôi bất cứ điều gì!</p>
                  </div>
                )}
                {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                        <i className="fas fa-robot text-sm"></i>
                    </div>
                    )}
                    <div className={`max-w-xs p-3 rounded-xl ${
                    msg.role === 'user'
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}>
                    <div className="text-sm">
                        <MathRenderer text={msg.text} className="whitespace-pre-wrap" />
                        {index === messages.length - 1 && msg.role === 'model' && isLoading && (
                            <span className="inline-block w-2 h-4 bg-slate-700 dark:bg-slate-200 animate-pulse ml-1 translate-y-0.5"></span>
                        )}
                    </div>
                    </div>
                </div>
                ))}
                {isLoading && messages[messages.length-1]?.role !== 'model' && (
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
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Ask a quick question..."
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    rows={2}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 flex-shrink-0 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50 self-end"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
                </div>
            </div>
        </>
      );
  }

  return (
    <div className="fixed bottom-28 right-4 sm:right-8 z-30 w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-sm h-[60vh] max-h-[500px] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-transform transform-gpu">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="font-bold text-lg">Quick Chat</h3>
            <button onClick={closeChat} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                <i className="fas fa-times"></i>
            </button>
        </div>
        {renderContent()}
    </div>
  );
};

export default QuickChat;