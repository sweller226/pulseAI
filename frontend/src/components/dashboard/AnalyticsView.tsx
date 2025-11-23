import React from 'react';
import { BarChart, Activity, TrendingUp } from 'lucide-react';

export const AnalyticsView = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-6 animate-fade-in glass-panel border-dashed">
            <div className="relative">
                <div className="absolute inset-0 bg-tactical-cyan/20 blur-xl rounded-full animate-pulse"></div>
                <Activity className="w-24 h-24 text-tactical-cyan relative z-10" />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">
                    Analytics Module
                </h2>
                <p className="text-tactical-textMuted font-mono max-w-md">
                    Advanced predictive modeling and trend analysis subsystem is currently initializing.
                </p>
            </div>

            <div className="flex gap-4 mt-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center w-32">
                    <div className="text-2xl font-bold text-tactical-purple mb-1">98%</div>
                    <div className="text-[10px] text-tactical-textMuted uppercase">Accuracy</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center w-32">
                    <div className="text-2xl font-bold text-tactical-emerald mb-1">24/7</div>
                    <div className="text-[10px] text-tactical-textMuted uppercase">Uptime</div>
                </div>
            </div>
        </div>
    );
};
