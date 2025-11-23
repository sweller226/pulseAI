import React from 'react';
import { MapPin, User } from 'lucide-react';

export const PatientInfo = () => {
    return (
        <div className="glass-panel p-4 animate-slide-up hover-lift relative">
            {/* Status Badge with smooth animation */}
            <div className="absolute top-3 right-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 px-3 py-1 glass-effect hover:bg-emerald-500/10 rounded-lg transition-smooth">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-glow shadow-lg shadow-emerald-500/50"></div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Monitoring</span>
                </div>
            </div>

            {/* Header Section with staggered animations */}
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 transition-smooth hover:scale-110 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
                    <User className="w-7 h-7 text-cyan-400 transition-smooth" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 transition-smooth hover:text-cyan-400">John Doe</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="glass-effect px-2 py-0.5 rounded border border-white/20 text-gray-300 font-medium transition-smooth hover:bg-white/10 hover:border-white/30">ID: #8492-TX</span>
                        <span className="flex items-center gap-1 text-cyan-400 glass-effect px-2 py-0.5 rounded border border-cyan-500/30 transition-smooth hover:bg-cyan-500/10 hover:border-cyan-500/50">
                            <MapPin className="w-3 h-3" /> ROOM 304-A
                        </span>
                    </div>
                </div>
            </div>

            {/* Patient Details Grid with staggered animations */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1 glass-effect p-3 rounded-lg transition-smooth hover:bg-white/10 hover-lift" style={{ animationDelay: '0.1s' }}>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide font-medium">Age / Sex</span>
                    <span className="text-white font-semibold">45 / Male</span>
                </div>
                <div className="space-y-1 glass-effect p-3 rounded-lg transition-smooth hover:bg-white/10 hover-lift" style={{ animationDelay: '0.15s' }}>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide font-medium">Blood Type</span>
                    <span className="text-white font-semibold">O-Positive</span>
                </div>
                <div className="space-y-1 glass-effect p-3 rounded-lg transition-smooth hover:bg-white/10 hover-lift" style={{ animationDelay: '0.2s' }}>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide font-medium">Condition</span>
                    <span className="text-white font-semibold text-xs">Post-Op Recovery</span>
                </div>
                <div className="space-y-1 bg-red-500/10 glass-effect p-3 rounded-lg border-red-500/30 transition-smooth hover:bg-red-500/15 hover:border-red-500/50 hover-lift" style={{ animationDelay: '0.25s' }}>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide font-medium">Allergies</span>
                    <span className="text-red-400 font-semibold">Penicillin</span>
                </div>
            </div>
        </div>
    );
};
