import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface VitalGraphCardProps {
    title: string;
    value: string;
    unit: string;
    status: 'ok' | 'warning' | 'critical';
    icon: LucideIcon;
    data: { time: string; value: number }[];
    color: string;
}

export const VitalGraphCard = ({ title, value, unit, status, icon: Icon, data, color }: VitalGraphCardProps) => {
    return (
        <div className="glass-panel p-2 h-full flex flex-col relative overflow-hidden group">
            {/* Background Glow */}
            <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: color }}
            ></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-0.5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <Icon className="w-4 h-4" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
                    </div>
                    <h3 className="text-sm font-mono font-bold text-tactical-text uppercase tracking-widest">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{value}</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-tactical-textMuted mb-0.5">{unit}</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'ok' ? 'bg-tactical-emerald' : 'bg-tactical-red'} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
                            <span className="text-[9px] font-mono font-bold uppercase text-white tracking-wider">{status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graph */}
            <div className="flex-1 min-h-[100px] w-full bg-black/40 rounded-lg border border-white/5 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                            </linearGradient>
                            <filter id={`glow-${title}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#404040"
                            tick={{ fill: '#606060', fontSize: 9, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                            dy={5}
                        />
                        <YAxis
                            stroke="#404040"
                            tick={{ fill: '#606060', fontSize: 9, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                fontFamily: 'monospace',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: color, fontWeight: 'bold', fontSize: '12px' }}
                            labelStyle={{ color: '#888', marginBottom: '4px', fontSize: '10px' }}
                            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill={`url(#gradient-${title})`}
                            strokeWidth={2}
                            animationDuration={2000}
                            filter={`url(#glow-${title})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
