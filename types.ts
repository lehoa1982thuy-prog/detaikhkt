
export type Subject = 'math' | 'literature' | 'english' | 'it';

export type View = 
  | 'dashboard' 
  | 'chat' 
  | 'planner' 
  | 'pomodoro'
  | 'flashcards'
  | Subject
  | `${Subject}-quiz`
  | `${Subject}-theory`;
  
export type Theme = 'light' | 'dark';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Flashcard {
  id: number;
  subject: Subject;
  question: string;
  answer: string;
}

export type SubjectProgress = Record<Subject, number>;

export interface AppData {
  progress: SubjectProgress;
  todos: Todo[];
  flashcards: Flashcard[];
}

export const subjectDetails: Record<Subject, { name: string; gradient: string; topics: string[] }> = {
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