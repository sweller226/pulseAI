import React from 'react';
import { Smile } from 'lucide-react';

interface MoodCardProps {
    mood?: string;
    confidence?: number;
}

export const MoodCard = ({ mood, confidence }: MoodCardProps) => {
    // Determine color based on mood
    const getMoodColor = (m?: string) => {
        const lowerMood = m?.toLowerCase() || '';
        if (lowerMood.includes('happy') || lowerMood.includes('neutral')) return '#10b981'; // Green
        if (lowerMood.includes('sad') || lowerMood.includes('fear')) return '#f59e0b'; // Amber
        if (lowerMood.includes('pain') || lowerMood.includes('distress') || lowerMood.includes('angry')) return '#ef4444'; // Red
        return '#3b82f6'; // Blue default
    };

    const color = getMoodColor(mood);

    return (
        <div className="glass-panel p-4 h-full flex flex-col animate-scale-in hover-lift">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl glass-effect transition-smooth hover:bg-white/10 hover:scale-110">
                        <Smile className="w-5 h-5 transition-smooth" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">MOOD</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div
                                className="w-2 h-2 rounded-full animate-pulse-glow"
                                style={{
                                    backgroundColor: color,
                                    boxShadow: `0 0 8px ${color}`
                                }}
                            ></div>
                            <span className="text-xs text-gray-400 capitalize font-medium">Live Analysis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center glass-effect rounded-xl transition-smooth hover:bg-white/5 relative overflow-hidden">
                {/* Background Glow */}
                <div
                    className="absolute inset-0 opacity-10 transition-smooth"
                    style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
                ></div>

                <div className="relative z-10 text-center">
                    <div className="text-3xl font-bold text-white capitalize mb-1 transition-smooth hover:scale-105">
                        {mood || 'Analyzing...'}
                    </div>
                    {confidence && (
                        <div className="text-xs text-gray-400">
                            Confidence: {(confidence * 100).toFixed(0)}%
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
