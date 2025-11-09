import React, { useMemo } from 'react';

const Snowfall: React.FC = () => {
    const snowflakeCount = 150;

    const snowflakes = useMemo(() => {
        return Array.from({ length: snowflakeCount }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}vw`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * 0.5 + 0.3,
            };
            return <div key={i} className="snowflake" style={style}></div>;
        });
    }, []);

    const keyframes = `
        @keyframes fall {
            0% { transform: translateY(0vh) rotate(0deg); }
            100% { transform: translateY(105vh) rotate(360deg); }
        }
    `;

    return (
        <div className="snowfall-container" aria-hidden="true">
            <style>
                {`
                    .snowfall-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 25;
                        overflow: hidden;
                    }
                    .snowflake {
                        position: absolute;
                        top: -10px;
                        background-color: white;
                        border-radius: 50%;
                        animation-name: fall;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                    }
                    ${keyframes}
                `}
            </style>
            {snowflakes}
        </div>
    );
};

export default Snowfall;
