import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

export const AICompanion = () => {
    return (
        <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-accent flex flex-col h-full relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-dashboard-info/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dashboard-info to-purple-500 flex items-center justify-center shadow-lg">
                        <BrainIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-medium text-dashboard-text">Guardian Assistant</h3>
                        <span className="text-xs text-dashboard-success flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-dashboard-success animate-pulse"></span>
                            Active & Listening
                        </span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-dashboard-accent transition-colors text-dashboard-textMuted hover:text-dashboard-text">
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 bg-dashboard-accent/30 rounded-xl p-4 mb-4 relative z-10">
                <p className="text-sm text-dashboard-text leading-relaxed">
                    "I've noticed Sarah's heart rate is slightly elevated but within normal range. She seems calm and is currently resting."
                </p>
            </div>

            <button className="w-full py-3 rounded-xl bg-dashboard-text text-dashboard-bg font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 relative z-10 group">
                <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Speak to Guardian</span>
            </button>
        </div>
    );
};

const BrainIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
);
