import React from 'react';
import { MapPin, User, Activity } from 'lucide-react';

export const PatientInfo = () => {
    return (
        <div className="glass-panel p-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
                <div className="flex items-center gap-2 px-2 py-0.5 bg-tactical-emerald/10 border border-tactical-emerald/30 rounded-full">
                    <div className="w-1 h-1 bg-tactical-emerald rounded-full animate-pulse shadow-[0_0_5px_#00ff88]"></div>
                    <span className="text-[9px] font-mono font-bold text-tactical-emerald uppercase">Monitoring</span>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-tactical-cyan/20 to-tactical-purple/20 border border-tactical-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.15)] relative">
                    <User className="w-6 h-6 text-tactical-cyan" />
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-tactical-cyan"></div>
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-tactical-cyan"></div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider mb-0.5">John Doe</h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-tactical-textMuted">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded">ID: #8492-TX</span>
                        <span className="flex items-center gap-1 text-tactical-cyan"><MapPin className="w-2.5 h-2.5" /> ROOM 304-A</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="space-y-0.5">
                    <span className="text-tactical-textMuted block text-[9px] uppercase tracking-widest">Age / Sex</span>
                    <span className="text-white font-bold text-xs">45 / Male</span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-tactical-textMuted block text-[9px] uppercase tracking-widest">Blood Type</span>
                    <span className="text-white font-bold text-xs">O-Positive</span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-tactical-textMuted block text-[9px] uppercase tracking-widest">Condition</span>
                    <span className="text-white font-bold text-xs">Post-Op Recovery</span>
                </div>
                <div className="space-y-0.5">
                    <span className="text-tactical-textMuted block text-[9px] uppercase tracking-widest">Allergies</span>
                    <span className="text-tactical-red font-bold text-xs">Penicillin</span>
                </div>
            </div>
        </div>
    );
};
