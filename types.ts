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