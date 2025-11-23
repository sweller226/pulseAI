import React from 'react';
import { Shield } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen w-full bg-tactical-bg text-tactical-text font-sans flex flex-col overflow-hidden">
            {/* Fixed Header - 60px */}
            <header className="h-[60px] flex-none bg-tactical-bgSec/80 backdrop-blur-md border-b border-tactical-border flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-tactical-cyan animate-pulse-glow" />
                    <h1 className="text-xl font-mono font-bold tracking-widest text-tactical-text uppercase">
                        Pulse<span className="text-tactical-cyan">AI</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-mono text-tactical-text font-bold">JOHN DOE</span>
                        <span className="text-[10px] font-mono text-tactical-emerald">STABLE</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tactical-cyan to-tactical-purple p-[1px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">JD</div>
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-tactical-bg to-transparent pointer-events-none z-10"></div>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};
