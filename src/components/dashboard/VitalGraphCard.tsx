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
    const statusColors = {
        ok: '#10b981',
        warning: '#f59e0b',
        critical: '#ef4444'
    };

    return (
        <div className="glass-panel p-4 h-full flex flex-col animate-scale-in hover-lift">
            {/* Header - Clean and Professional with smooth animations */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl glass-effect transition-smooth hover:bg-white/10 hover:scale-110">
                        <Icon className="w-5 h-5 transition-smooth" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">{title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div
                                className="w-2 h-2 rounded-full animate-pulse-glow"
                                style={{
                                    backgroundColor: statusColors[status],
                                    boxShadow: `0 0 8px ${statusColors[status]}`
                                }}
                            ></div>
                            <span className="text-xs text-gray-400 capitalize font-medium">{status}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-white tabular-nums transition-smooth hover:scale-105">{value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">{unit}</div>
                </div>
            </div>

            {/* Graph - Professional Medical Chart with smooth animations */}
            <div className="flex-1 min-h-[120px] w-full glass-effect rounded-xl overflow-hidden transition-smooth hover:bg-white/5">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                            </linearGradient>
                            {/* Subtle glow effect */}
                            <filter id={`glow-${title}`}>
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.08)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                            width={35}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(20px)',
                                padding: '10px 14px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ color: color, fontWeight: '600', fontSize: '13px' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px', fontSize: '11px' }}
                            cursor={{ stroke: color, strokeWidth: 1.5, strokeDasharray: '5 5', opacity: 0.3 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill={`url(#gradient-${title})`}
                            strokeWidth={2.5}
                            animationDuration={1800}
                            animationEasing="ease-in-out"
                            filter={`url(#glow-${title})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
