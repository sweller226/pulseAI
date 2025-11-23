import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Wind, Activity, Heart } from 'lucide-react';

interface VitalsPanelProps {
    vitals: any;
    hrData: any[];
    respData: any[];
    alertActive?: boolean;
}

export const VitalsPanel = ({ vitals, hrData, respData, alertActive }: VitalsPanelProps) => {
    return (
        <div className="vitals-col">
            {/* Critical Alert Banner */}
            {alertActive && (
                <div className="glass-panel p-4 border-red-500/50 bg-red-500/10 flex items-center gap-3 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Connection Interrupted</span>
                </div>
            )}

            {/* Heart Rate Card */}
            <div className="glass-panel vital-card">
                <div className="vital-header">
                    <Heart className="vital-icon w-4 h-4" />
                    <span className="vital-title">Heart Rate</span>
                </div>

                <div className="vital-value-row">
                    <span className="vital-value text-blue-400">
                        {vitals?.pulse_rate || '--'}
                    </span>
                    <span className="vital-unit">BPM</span>
                </div>

                <div className="h-24 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hrData}>
                            <defs>
                                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#gradBlue)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breathing Rate Card */}
            <div className="glass-panel vital-card">
                <div className="vital-header">
                    <Wind className="vital-icon w-4 h-4" />
                    <span className="vital-title">Respiration</span>
                </div>

                <div className="vital-value-row">
                    <span className="vital-value text-cyan-400">
                        {vitals?.breathing_rate || '--'}
                    </span>
                    <span className="vital-unit">RPM</span>
                </div>

                <div className="h-24 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={respData}>
                            <defs>
                                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#22d3ee"
                                strokeWidth={2}
                                fill="url(#gradCyan)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* O2 Saturation Card */}
            <div className="glass-panel vital-card">
                <div className="vital-header">
                    <Activity className="vital-icon w-4 h-4" />
                    <span className="vital-title">O2 Saturation</span>
                </div>

                <div className="vital-value-row">
                    <span className="vital-value text-emerald-400">
                        98
                    </span>
                    <span className="vital-unit">%</span>
                </div>

                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                </div>
            </div>
        </div>
    );
};
