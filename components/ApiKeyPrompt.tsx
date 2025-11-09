import React from 'react';

interface ApiKeyPromptProps {
    onSelectApiKey: () => void;
    featureName?: string;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSelectApiKey, featureName = "AI features" }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <div className="text-5xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                    <i className="fas fa-key"></i>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">API Key Required</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    To use {featureName}, please select your Google AI API key.
                </p>
                <button
                    onClick={onSelectApiKey}
                    className="w-full px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-opacity"
                    aria-label="Select API Key"
                >
                    Select API Key
                </button>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    For information on billing, please visit{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">
                        ai.google.dev/gemini-api/docs/billing
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyPrompt;
