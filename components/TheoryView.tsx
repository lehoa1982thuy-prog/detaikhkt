import React, { useState, useEffect } from 'react';
import type { Subject } from '../types';
import { subjectDetails } from '../types';
import { GoogleGenAI } from '@google/genai';
import ApiKeyPrompt from './ApiKeyPrompt';
import MathRenderer from './MathRenderer';

const TheoryView: React.FC<{ subject: Subject }> = ({ subject }) => {
  const details = subjectDetails[subject];
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(true);

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

   const selectApiKey = async () => {
     if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };
  
  const handleGetExplanation = async (topic: string) => {
    if (!hasApiKey) {
        return;
    }
    setSelectedTopic(topic);
    setIsLoading(true);
    setAiExplanation('');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Hãy giải thích chủ đề "${topic}" trong môn ${details.name} một cách đơn giản, ngắn gọn, và dễ hiểu cho học sinh trung học.`,
        });
        setAiExplanation(response.text);
    } catch (error) {
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
            setHasApiKey(false);
            setAiExplanation("Your API key appears to be invalid. Please select a valid key to continue getting AI explanations.");
        } else {
            console.error("Error fetching AI explanation:", error);
            setAiExplanation("Rất tiếc, đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại.");
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isCheckingApiKey) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
             <div className="text-xl font-semibold">Checking for API Key...</div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          <span className={`bg-gradient-to-r ${details.gradient} bg-clip-text text-transparent`}>
            Lý thuyết môn {details.name}
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Chọn một chủ đề để xem giải thích từ AI.
        </p>
      </div>

      {!hasApiKey ? (
        <ApiKeyPrompt onSelectApiKey={selectApiKey} featureName={`AI explanations for ${details.name}`} />
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.topics.map(topic => (
                <button 
                    key={topic}
                    onClick={() => handleGetExplanation(topic)}
                    disabled={isLoading && selectedTopic === topic}
                    className={`p-4 rounded-lg text-left transition-colors ${
                    selectedTopic === topic 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-wait`}
                >
                    {topic}
                </button>
                ))}
            </div>
            
            {(isLoading || aiExplanation) && (
                <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                    Giải thích cho: <span className="text-indigo-500">{selectedTopic}</span>
                </h3>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                        <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    </div>
                ) : (
                    <MathRenderer text={aiExplanation} className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed" />
                )}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default TheoryView;