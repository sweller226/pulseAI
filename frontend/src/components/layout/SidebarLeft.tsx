import React from 'react';
import { MapPin } from 'lucide-react';

interface SidebarLeftProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const SidebarLeft = ({ activeTab, onTabChange }: SidebarLeftProps) => {
    return (
        <div className="w-full h-full flex flex-col p-4 gap-4">
            {/* Patient Info Card */}
            <div className="glass-panel p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2">
                    <div className="w-2 h-2 bg-tactical-emerald rounded-full animate-pulse shadow-[0_0_5px_#00ff88]"></div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-tactical-cyan/20 to-tactical-purple/20 border border-tactical-cyan/30 flex items-center justify-center text-tactical-cyan font-mono font-bold text-lg shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                        SC
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-tactical-text font-mono uppercase tracking-wider">Sarah Connor</h3>
                        <p className="text-[10px] text-tactical-textSec font-mono">ID: #8492-TX</p>
                    </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-tactical-textMuted">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>AGE/SEX</span> <span className="text-tactical-text">64 / F</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>BLOOD</span> <span className="text-tactical-text">O-NEG</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span>LOC</span> <span className="text-tactical-cyan flex items-center gap-1"><MapPin className="w-3 h-3" /> ROOM 304-A</span>
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <h3 className="text-[10px] font-mono text-tactical-textMuted uppercase tracking-widest mb-3 pl-1">Recent Alerts</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    <AlertItem time="10:42" title="FALL DETECTED" level="critical" />
                    <AlertItem time="09:15" title="HR ELEVATED" level="warning" />
                    <AlertItem time="08:30" title="MEDICATION MISSED" level="info" />
                    <AlertItem time="Yesterday" title="ROUTINE CHECK" level="success" />
                </div>
            </div>
        </div>
    );
};

const AlertItem = ({ time, title, level }: { time: string, title: string, level: 'info' | 'success' | 'warning' | 'critical' }) => {
    const colors = {
        info: 'bg-tactical-cyan',
        success: 'bg-tactical-emerald',
        warning: 'bg-tactical-amber',
        critical: 'bg-tactical-red'
    };

    return (
        <div className="flex items-center gap-3 p-2 rounded-md bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-1.5 h-1.5 rounded-full ${colors[level]} shadow-[0_0_5px_currentColor]`}></div>
            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono text-tactical-textMuted">{time}</div>
                <div className="text-xs font-mono font-bold text-tactical-text truncate">{title}</div>
            </div>
        </div>
    );
};
