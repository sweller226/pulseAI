import React from 'react';
import { Activity } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen w-full bg-black text-white font-sans flex flex-col overflow-hidden">
            {/* Fixed Header - Clean and Professional with smooth animation */}
            <header className="h-[60px] flex-none glass-panel bg-neutral-900/60 border-b border-white/20 flex items-center justify-between px-6 sticky top-0 z-50 animate-slide-up">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white transition-smooth hover:text-cyan-400">
                        Pulse<span className="text-cyan-400">AI</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-white">John Doe</span>
                        <span className="text-xs text-emerald-400 font-medium">Stable</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer">
                        JD
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <main className="flex-1 relative flex flex-col overflow-hidden bg-gradient-to-br from-black via-neutral-950 to-black">
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};
