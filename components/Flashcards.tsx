import React, { useState, useMemo } from 'react';
import type { Flashcard, Subject } from '../types';

interface FlashcardsProps {
    flashcards: Flashcard[];
    onUpdateFlashcards: (flashcards: Flashcard[]) => void;
}

const subjectOptions: { value: Subject; label: string, gradient: string }[] = [
    { value: 'math', label: 'Toán học', gradient: 'from-blue-500 to-cyan-500' },
    { value: 'literature', label: 'Ngữ văn', gradient: 'from-purple-500 to-pink-500' },
    { value: 'english', label: 'Tiếng Anh', gradient: 'from-green-500 to-lime-500' },
    { value: 'it', label: 'Tin học', gradient: 'from-orange-500 to-amber-500' },
];

const Flashcards: React.FC<FlashcardsProps> = ({ flashcards, onUpdateFlashcards }) => {
    const [isQuizMode, setIsQuizMode] = useState(false);
    
    const [newCardSubject, setNewCardSubject] = useState<Subject>('math');
    const [newCardQuestion, setNewCardQuestion] = useState('');
    const [newCardAnswer, setNewCardAnswer] = useState('');

    const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all');

    const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const filteredFlashcards = useMemo(() => {
        if (subjectFilter === 'all') return flashcards;
        return flashcards.filter(card => card.subject === subjectFilter);
    }, [flashcards, subjectFilter]);

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCardQuestion.trim() === '' || newCardAnswer.trim() === '') return;
        const newCard: Flashcard = {
            id: Date.now(),
            subject: newCardSubject,
            question: newCardQuestion,
            answer: newCardAnswer,
        };
        onUpdateFlashcards([newCard, ...flashcards]);
        setNewCardQuestion('');
        setNewCardAnswer('');
    };

    const handleDeleteCard = (id: number) => {
        onUpdateFlashcards(flashcards.filter(card => card.id !== id));
    };

    const handleStartQuiz = () => {
        if (filteredFlashcards.length === 0) return;
        setQuizCards(filteredFlashcards);
        setCurrentQuizIndex(0);
        setIsFlipped(false);
        setIsQuizMode(true);
    };

    const handleEndQuiz = () => {
        setIsQuizMode(false);
        setQuizCards([]);
    }

    const handleNextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentQuizIndex(prev => (prev + 1) % quizCards.length);
        }, 150)
    };
    
    const handlePrevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentQuizIndex(prev => (prev - 1 + quizCards.length) % quizCards.length);
        }, 150);
    };

    if (isQuizMode) {
        const currentCard = quizCards[currentQuizIndex];
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-full max-w-2xl mb-8 [perspective:1000px]">
                    <div 
                        className={`relative w-full h-80 rounded-2xl shadow-lg cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front of Card */}
                        <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Câu hỏi</p>
                            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{currentCard.question}</p>
                        </div>
                        {/* Back of Card */}
                        <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Đáp án</p>
                            <p className="text-xl font-medium text-slate-700 dark:text-slate-200">{currentCard.answer}</p>
                        </div>
                    </div>
                </div>

                <p className="mb-4 text-slate-500 dark:text-slate-400 font-medium">Thẻ {currentQuizIndex + 1} / {quizCards.length}</p>

                <div className="flex items-center gap-4 mb-8">
                    <button onClick={handlePrevCard} className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><i className="fas fa-arrow-left"></i></button>
                    <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity">Lật thẻ</button>
                    <button onClick={handleNextCard} className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><i className="fas fa-arrow-right"></i></button>
                </div>
                
                <button onClick={handleEndQuiz} className="font-semibold text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Kết thúc</button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Học với Flashcards</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Tạo, quản lý và ôn tập kiến thức hiệu quả.</p>
            </div>

            {/* Create Card Form */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Tạo Flashcard mới</h2>
                <form onSubmit={handleAddCard} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Môn học</label>
                        <select value={newCardSubject} onChange={e => setNewCardSubject(e.target.value as Subject)} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                           {subjectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Câu hỏi</label>
                        <textarea value={newCardQuestion} onChange={e => setNewCardQuestion(e.target.value)} placeholder="Mặt trước của thẻ..." rows={2} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Câu trả lời</label>
                        <textarea value={newCardAnswer} onChange={e => setNewCardAnswer(e.target.value)} placeholder="Mặt sau của thẻ..." rows={3} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity">Thêm thẻ</button>
                </form>
            </div>

            {/* Card List */}
            <div>
                 <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                    <h2 className="text-2xl font-bold">Bộ sưu tập của bạn</h2>
                    <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <button onClick={() => setSubjectFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${subjectFilter === 'all' ? 'bg-white dark:bg-slate-500' : 'hover:bg-white/60 dark:hover:bg-slate-500/60'}`}>Tất cả</button>
                        {subjectOptions.map(opt => (
                             <button key={opt.value} onClick={() => setSubjectFilter(opt.value)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${subjectFilter === opt.value ? 'bg-white dark:bg-slate-500' : 'hover:bg-white/60 dark:hover:bg-slate-500/60'}`}>{opt.label}</button>
                        ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    {filteredFlashcards.map(card => {
                        const subjectInfo = subjectOptions.find(s => s.value === card.subject);
                        return (
                            <div key={card.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-slate-800 dark:text-slate-100">{card.question}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${subjectInfo?.gradient} text-white`}>
                                        {subjectInfo?.label}
                                    </span>
                                </div>
                                <button onClick={() => handleDeleteCard(card.id)} className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        )
                    })}
                    {filteredFlashcards.length === 0 && (
                        <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg">
                            <p className="text-slate-500 dark:text-slate-400">Không có thẻ nào trong bộ sưu tập này.</p>
                        </div>
                    )}
                </div>

                 <button 
                    onClick={handleStartQuiz} 
                    disabled={filteredFlashcards.length === 0}
                    className="mt-6 w-full py-4 text-white font-bold rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                    Bắt đầu ôn tập ({filteredFlashcards.length} thẻ)
                </button>
            </div>
        </div>
    )
};

export default Flashcards;