
import type { AppData } from '../types';

const DB_KEY = 'ai-study-assistant-data';

const defaultData: AppData = {
  progress: {
    math: 45,
    literature: 60,
    english: 75,
    it: 30,
  },
  todos: [
    { id: 1, text: 'Làm bài tập Toán chương 3', completed: false },
    { id: 2, text: 'Soạn văn bài "Lão Hạc"', completed: true },
    { id: 3, text: 'Học 20 từ vựng tiếng Anh mới', completed: false },
  ],
  flashcards: [
    { id: 1, subject: 'math', question: 'Định lý Pytago phát biểu như thế nào?', answer: 'Trong một tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.' },
    { id: 2, subject: 'it', question: 'CSS là viết tắt của cụm từ gì?', answer: 'Cascading Style Sheets' },
    { id: 3, subject: 'english', question: 'What is the past participle of "go"?', answer: 'Gone' },
  ],
};

export const loadAppData = (): AppData => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      // Basic validation to ensure data structure is not completely broken
      if (parsedData.progress && parsedData.todos) {
        return {
          ...defaultData,
          ...parsedData,
          flashcards: parsedData.flashcards || defaultData.flashcards,
        };
      }
    }
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
  }
  // Return default data if nothing in localStorage or if data is corrupt
  return defaultData;
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};