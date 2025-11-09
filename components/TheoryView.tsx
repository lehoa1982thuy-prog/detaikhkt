import React, { useState } from 'react';
import type { Subject } from '../types';
import { subjectDetails } from '../types';
import { GoogleGenAI } from '@google/genai';
import MathRenderer from './MathRenderer';

const TheoryView: React.FC<{ subject: Subject }> = ({ subject }) => {
  const details = subjectDetails[subject];
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [inputTopic, setInputTopic] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetExplanation = async (topic: string) => {
    if (topic.trim() === '' || isLoading) return;

    setSelectedTopic(topic);
    setIsLoading(true);
    setAiExplanation('');
    try {
      if (!process.env.API_KEY) {
          throw new Error("API key is not provided.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Hãy đóng vai một người thầy giáo tận tâm và soạn một bài giảng chi tiết về chủ đề "${topic}" trong môn ${details.name} cho học sinh trung học. Bài giảng cần có cấu trúc rõ ràng, bao gồm 3 phần chính:

1.  **Lý thuyết cốt lõi:** Giải thích các khái niệm, định nghĩa, và công thức quan trọng một cách trực quan, dễ hiểu.
2.  **Phương pháp giải bài tập:** Hướng dẫn từng bước cách tiếp cận và giải quyết các dạng bài tập phổ biến liên quan đến chủ đề. Nêu các mẹo và lưu ý khi làm bài.
3.  **Ví dụ minh họa:** Cung cấp ít nhất một ví dụ cụ thể, có lời giải chi tiết để học sinh có thể áp dụng ngay kiến thức vừa học.

Hãy trình bày bài giảng một cách mạch lạc, sử dụng ngôn ngữ thân thiện và khuyến khích học sinh.`,
      });
      setAiExplanation(response.text ?? "Không nhận được phản hồi từ AI. Vui lòng thử lại.");
    } catch (error) {
      if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("provide an API key"))) {
        setAiExplanation("API key của bạn không hợp lệ. Vui lòng kiểm tra tệp .env và làm mới trang để sử dụng tính năng này.");
      } else {
        console.error("Error fetching AI explanation:", error);
        setAiExplanation("Rất tiếc, đã có lỗi xảy ra khi tạo giải thích. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (topic: string) => {
    setInputTopic(topic);
    handleGetExplanation(topic);
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
          Nhập một chủ đề bạn muốn AI giảng bài, hoặc chọn từ các gợi ý bên dưới.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
            type="text"
            value={inputTopic}
            onChange={e => setInputTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGetExplanation(inputTopic)}
            placeholder={`Ví dụ: ${details.topics[0]}`}
            className="flex-1 w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
            onClick={() => handleGetExplanation(inputTopic)}
            disabled={isLoading || inputTopic.trim() === ''}
            className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
            {isLoading && selectedTopic === inputTopic ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải...</>
            ) : "Giảng bài"}
            </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Gợi ý:</span>
            {details.topics.map(topic => (
            <button
                key={topic}
                onClick={() => handleSuggestionClick(topic)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
                {topic}
            </button>
            ))}
        </div>
      </div>


      {(isLoading || aiExplanation) && (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            Bài giảng cho chủ đề: <span className="text-indigo-500">{selectedTopic}</span>
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
    </div>
  );
};

export default TheoryView;