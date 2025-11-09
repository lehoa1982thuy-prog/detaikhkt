
import React, { useState } from 'react';
import type { Todo } from '../types';

interface PlannerProps {
    todos: Todo[];
    onUpdateTodos: (todos: Todo[]) => void;
}

const Planner: React.FC<PlannerProps> = ({ todos, onUpdateTodos }) => {
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    onUpdateTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdateTodos(updatedTodos);
  };
  
  const removeTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    onUpdateTodos(updatedTodos);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Kế hoạch học tập</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Thêm công việc mới..."
          className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity"
        >
          Thêm
        </button>
      </div>

      <div className="space-y-4">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
            <div className="flex items-center gap-4">
               <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              <span className={`text-slate-800 dark:text-slate-100 ${todo.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                {todo.text}
              </span>
            </div>
             <button onClick={() => removeTodo(todo.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
        {todos.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400">Bạn chưa có kế hoạch nào.</p>}
      </div>
    </div>
  );
};

export default Planner;