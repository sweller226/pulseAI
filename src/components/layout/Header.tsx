import React from 'react';
import { Activity, Wifi } from 'lucide-react';

export const Header = () => {
    return (
        <header className="w-full h-16 border-b border-dashboard-accent bg-dashboard-bg/80 backdrop-blur-md fixed top-0 left-0 z-50 flex items-center justify-between px-6">
            {/* Left: App Name */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-dashboard-info/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-dashboard-info" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight text-dashboard-text">
                    Guardian<span className="text-dashboard-info">AI</span>
                </h1>
            </div>

            {/* Center: Patient Info */}
            <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex flex-col items-center">
                    <span className="text-dashboard-textMuted text-xs uppercase tracking-wider">Patient</span>
                    <span className="font-medium text-dashboard-text">Sarah Connor</span>
                </div>
                <div className="w-px h-8 bg-dashboard-accent"></div>
                <div className="flex flex-col items-center">
                    <span className="text-dashboard-textMuted text-xs uppercase tracking-wider">Age</span>
                    <span className="font-medium text-dashboard-text">64</span>
                </div>
                <div className="w-px h-8 bg-dashboard-accent"></div>
                <div className="flex flex-col items-center">
                    <span className="text-dashboard-textMuted text-xs uppercase tracking-wider">Room</span>
                    <span className="font-medium text-dashboard-text">304-A</span>
                </div>
            </div>

            {/* Right: Status */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dashboard-card border border-dashboard-accent">
                    <div className="w-2 h-2 rounded-full bg-dashboard-success animate-pulse"></div>
                    <span className="text-xs font-medium text-dashboard-success">Live Connected</span>
                    <Wifi className="w-3 h-3 text-dashboard-success" />
                </div>
                <div className="w-8 h-8 rounded-full bg-dashboard-accent flex items-center justify-center text-xs font-bold text-dashboard-text">
                    SC
                </div>
            </div>
        </header>
    );
};
