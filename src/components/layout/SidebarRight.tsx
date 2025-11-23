import React from 'react';
import { Activity, TrendingUp, Heart, Wind, Thermometer, Droplets } from 'lucide-react';
import { VitalsCard } from '../dashboard/VitalsCard';

export const SidebarRight = () => {
    // Mock Data for Sparklines
    const heartData = Array.from({ length: 10 }, () => ({ value: 60 + Math.random() * 20 }));
    const respData = Array.from({ length: 10 }, () => ({ value: 12 + Math.random() * 8 }));
    const bpData = Array.from({ length: 10 }, () => ({ value: 110 + Math.random() * 20 }));
    const tempData = Array.from({ length: 10 }, () => ({ value: 98 + Math.random() * 1 }));

    return (
        <div className="w-full h-full flex flex-col p-4 gap-4">
            {/* Vitals Grid */}
            <div className="flex-none">
                <h3 className="text-[10px] font-mono text-tactical-textMuted uppercase tracking-widest mb-3 pl-1">Real-time Vitals</h3>
                <div className="grid grid-cols-2 gap-3">
                    <VitalsCard
                        title="HEART"
                        value="72"
                        unit="BPM"
                        icon={Heart}
                        color="#00d9ff"
                        data={heartData}
                        trend="+2%"
                    />
                    <VitalsCard
                        title="RESP"
                        value="16"
                        unit="RPM"
                        icon={Wind}
                        color="#00ff88"
                        data={respData}
                        trend="STABLE"
                    />
                    <VitalsCard
                        title="BP"
                        value="120/80"
                        unit="mmHg"
                        icon={Activity}
                        color="#a78bfa"
                        data={bpData}
                        status="warning"
                    />
                    <VitalsCard
                        title="TEMP"
                        value="98.6"
                        unit="°F"
                        icon={Thermometer}
                        color="#f59e0b"
                        data={tempData}
                    />
                </div>
            </div>

            {/* Key Metrics */}
            <div className="flex-none">
                <h3 className="text-[10px] font-mono text-tactical-textMuted uppercase tracking-widest mb-3 pl-1">Health Metrics</h3>
                <div className="glass-panel p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-tactical-textSec">Health Score</span>
                        <span className="text-sm font-mono font-bold text-tactical-cyan">92/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-tactical-cyan to-tactical-purple"></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-xs font-mono text-tactical-textSec">Trend</span>
                        <span className="text-xs font-mono font-bold text-tactical-emerald flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +2.4%
                        </span>
                    </div>
                </div>
            </div>

            {/* History Timeline */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <h3 className="text-[10px] font-mono text-tactical-textMuted uppercase tracking-widest mb-3 pl-1">Timeline</h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar relative pl-2">
                    <div className="absolute left-[5px] top-0 bottom-0 w-px bg-tactical-border"></div>
                    <div className="space-y-4">
                        <TimelineEvent time="Now" title="Monitoring Active" type="active" />
                        <TimelineEvent time="10:42" title="Fall Detected" type="critical" />
                        <TimelineEvent time="10:40" title="Movement Spike" type="warning" />
                        <TimelineEvent time="08:00" title="Shift Started" type="info" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimelineEvent = ({ time, title, type }: { time: string, title: string, type: 'active' | 'info' | 'warning' | 'critical' }) => {
    const colors = {
        active: 'bg-tactical-cyan shadow-[0_0_8px_#00d9ff]',
        info: 'bg-tactical-textMuted',
        warning: 'bg-tactical-amber',
        critical: 'bg-tactical-red'
    };

    return (
        <div className="relative pl-6 group">
            <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-tactical-bg ${colors[type]} z-10`}></div>
            <div className="text-[10px] font-mono text-tactical-textMuted mb-0.5">{time}</div>
            <div className={`text-xs font-mono ${type === 'active' ? 'text-tactical-cyan font-bold' : 'text-tactical-text'}`}>
                {title}
            </div>
        </div>
    );
};
