import React, { useState } from 'react';
import type { Subject } from '../types';
// FIX: Import GoogleGenAI for Gemini API functionality.
import { GoogleGenAI } from '@google/genai';

const subjectDetails: Record<Subject, { name: string; gradient: string; topics: string[] }> = {
  math: { 
    name: 'Toán học', 
    gradient: 'from-blue-500 to-cyan-500',
    topics: ['Định lý Pythagoras', 'Phương trình bậc hai', 'Đạo hàm và Tích phân', 'Hình học không gian']
  },
  literature: { 
    name: 'Ngữ văn', 
    gradient: 'from-purple-500 to-pink-500',
    topics: ['Phân tích nhân vật Chí Phèo', 'Chủ nghĩa hiện thực trong văn học', 'Thơ mới lãng mạn', 'Tác phẩm Vợ Nhặt']
  },
  english: { 
    name: 'Tiếng Anh', 
    gradient: 'from-green-500 to-lime-500',
    topics: ['Thì Hiện tại hoàn thành', 'Câu điều kiện loại 2', 'Mệnh đề quan hệ', 'Cách dùng mạo từ a/an/the']
  },
  it: { 
    name: 'Tin học', 
    gradient: 'from-orange-500 to-amber-500',
    topics: ['Cấu trúc dữ liệu và giải thuật', 'Lập trình hướng đối tượng (OOP)', 'Mạng máy tính cơ bản', 'Cơ sở dữ liệu quan hệ']
  },
};

const TheoryView: React.FC<{ subject: Subject }> = ({ subject }) => {
  const details = subjectDetails[subject];
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGetExplanation = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setAiExplanation('');
    try {
        // FIX: Initialize GoogleGenAI client to call the API.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Hãy giải thích chủ đề "${topic}" trong môn ${details.name} một cách đơn giản, ngắn gọn, và dễ hiểu cho học sinh trung học.`,
        });
        // FIX: Access the generated text directly from the response object.
        setAiExplanation(response.text);
    } catch (error) {
        console.error("Error fetching AI explanation:", error);
        setAiExplanation("Rất tiếc, đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại.");
    } finally {
        setIsLoading(false);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.topics.map(topic => (
          <button 
            key={topic}
            onClick={() => handleGetExplanation(topic)}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedTopic === topic 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
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
             <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {aiExplanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TheoryView;
