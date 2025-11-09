import React, { useState, useEffect } from 'react';

const CursorFollower: React.FC = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className={`fixed w-12 h-12 rounded-full flex items-center justify-center text-lg text-white bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg pointer-events-none transition-opacity duration-300
            ${isVisible ? 'opacity-70' : 'opacity-0'}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
                willChange: 'transform',
                zIndex: 9999,
            }}
        >
            <i className="fas fa-book"></i>
        </div>
    );
};

export default CursorFollower;