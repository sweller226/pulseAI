import React from 'react';
import { AlertTriangle, Phone, Users, XCircle, Play, FileText, Activity } from 'lucide-react';
import { VitalsCard } from './VitalsCard';
import { Heart, Wind } from 'lucide-react';

export const AlertPanel = () => {
    return (
        <div className="bg-tactical-bgSec border border-tactical-red rounded-sm overflow-hidden relative animate-pulse-glow shadow-[0_0_30px_rgba(255,59,59,0.2)]">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-tactical-red to-red-900 px-6 py-3 flex items-center justify-between relative overflow-hidden">
                {/* Striped Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[size:20px_20px] opacity-50"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-2 bg-black/20 rounded-sm">
                        <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div>
                        <h2 className="text-xl font-mono font-bold text-white tracking-widest uppercase">CRITICAL ALERT</h2>
                        <p className="text-xs font-mono text-white/80 tracking-wider">CODE: FALL-DETECT-01</p>
                    </div>
                </div>
                <span className="text-white font-mono font-bold text-lg animate-pulse">T+00:00:45</span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Video Replay */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative border-2 border-tactical-red rounded-sm overflow-hidden aspect-video bg-black group cursor-pointer">
                        <div className="absolute inset-0 bg-tactical-red/10 flex items-center justify-center group-hover:bg-tactical-red/20 transition-colors">
                            <div className="w-16 h-16 rounded-full border-2 border-tactical-red flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,59,59,0.5)]">
                                <Play className="w-8 h-8 text-tactical-red ml-1" />
                            </div>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop"
                            alt="Event Recording"
                            className="w-full h-full object-cover opacity-50 grayscale contrast-125"
                        />
                        <div className="absolute top-2 right-2 bg-tactical-red text-black text-xs font-mono font-bold px-2 py-1">
                            EVENT RECORDING
                        </div>
                    </div>

                    <div className="bg-tactical-bg border border-tactical-red/30 p-4 relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-tactical-red"></div>
                        <h3 className="text-tactical-red font-mono font-bold mb-2 flex items-center gap-2 uppercase text-sm">
                            <Activity className="w-4 h-4" /> AI Analysis Report
                        </h3>
                        <p className="text-tactical-text text-sm font-mono leading-relaxed opacity-90">
                            &gt;&gt; SUDDEN ELEVATION CHANGE DETECTED [-1.2M]<br />
                            &gt;&gt; MOVEMENT INDEX: 0 (STATIC)<br />
                            &gt;&gt; HR SPIKE: 110 BPM (+35%)<br />
                            &gt;&gt; CONCLUSION: HIGH PROBABILITY OF FALL EVENT. IMMEDIATE ASSISTANCE REQUIRED.
                        </p>
                    </div>
                </div>

                {/* Right: Vitals Snapshot & Actions */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        <VitalsCard
                            title="HR (EVENT)"
                            value="110"
                            unit="BPM"
                            icon={Heart}
                            color="text-tactical-red"
                            trend="+35%"
                            status="critical"
                        />
                        <VitalsCard
                            title="RESP (EVENT)"
                            value="22"
                            unit="RPM"
                            icon={Wind}
                            color="text-tactical-amber"
                            trend="+15%"
                            status="warning"
                        />
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-4 bg-tactical-red hover:bg-red-600 text-white font-mono font-bold text-lg shadow-[0_0_20px_rgba(255,59,59,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider clip-path-button">
                            <Phone className="w-5 h-5" />
                            DISPATCH 911
                        </button>
                        <button className="w-full py-3 bg-tactical-amber hover:bg-amber-600 text-black font-mono font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                            <Users className="w-5 h-5" />
                            Alert Family
                        </button>
                        <button className="w-full py-3 bg-transparent border border-tactical-textMuted text-tactical-textMuted hover:border-tactical-text hover:text-tactical-text font-mono font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                            <XCircle className="w-5 h-5" />
                            False Alarm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
