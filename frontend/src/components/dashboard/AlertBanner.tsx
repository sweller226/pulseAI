import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Phone, XCircle } from 'lucide-react';

export const AlertBanner = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="fixed top-[60px] left-0 right-0 z-50 px-4 pt-4 pointer-events-none animate-slide-in">
            <div className="pointer-events-auto">
                <div className={`
        relative overflow-hidden rounded-lg border border-tactical-red bg-tactical-red/10 backdrop-blur-md transition-all duration-300
        ${isExpanded ? 'h-auto' : 'h-[60px]'}
      `}>
                    {/* Pulsing Background */}
                    <div className="absolute inset-0 bg-tactical-red/5 animate-pulse"></div>

                    {/* Header Row */}
                    <div className="flex items-center justify-between p-4 relative z-10 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-tactical-red rounded-md animate-bounce">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 relative z-10 border-t border-tactical-red/20 pt-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-mono text-tactical-textMuted">
                                                    <span>HEART RATE SPIKE</span>
                                                    <span className="text-tactical-red font-bold">110 BPM (+35%)</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-mono text-tactical-textMuted">
                                                    <span>IMPACT FORCE</span>
                                                    <span className="text-tactical-amber font-bold">2.4 G</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-mono text-tactical-textMuted">
                                                    <span>POSTURE</span>
                                                    <span className="text-tactical-text">HORIZONTAL (FLOOR)</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 justify-end">
                                                <button className="flex-1 py-3 bg-tactical-red hover:bg-red-600 text-white font-mono font-bold rounded-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,59,59,0.4)] transition-all">
                                                    <Phone className="w-4 h-4" /> DISPATCH 911
                                                </button>
                                                <button className="px-4 py-3 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-mono font-bold rounded-md transition-all">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        );
};
