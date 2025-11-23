import React from 'react';
import { Video, Maximize2, Crosshair, Activity } from 'lucide-react';


export const LiveMonitor = () => {
    return (
        <div className="h-full flex flex-col gap-4">
            {/* Main Video Feed */}
            <div className="flex-1 max-h-[45vh] relative bg-black rounded-xl overflow-hidden border-2 border-tactical-border group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* HUD Corners */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-tactical-cyan/50 rounded-tl-lg z-20"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-tactical-cyan/50 rounded-tr-lg z-20"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-tactical-cyan/50 rounded-bl-lg z-20"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-tactical-cyan/50 rounded-br-lg z-20"></div>

                {/* Crosshair Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
                    <Crosshair className="w-96 h-96 text-tactical-cyan stroke-[0.5]" />
                </div>

                {/* Status Bar Top */}
                <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-black/60 border border-tactical-cyan/30 backdrop-blur-md rounded-md">
                        <div className="w-2 h-2 rounded-full bg-tactical-red animate-pulse shadow-[0_0_8px_#ff3b3b]"></div>
                        <span className="text-xs font-mono font-bold text-white tracking-wider">LIVE REC</span>
                        <span className="text-xs font-mono text-tactical-textMuted border-l border-white/10 pl-3 ml-1">00:42:15</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-tactical-cyan/30 backdrop-blur-md rounded-md">
                        <Video className="w-3 h-3 text-tactical-cyan" />
                        <span className="text-xs font-mono text-tactical-cyan">CAM-01 [ACTIVE]</span>
                    </div>
                </div>

                {/* AI Analysis Overlay */}
                <div className="absolute bottom-8 left-8 z-20">
                    <div className="bg-black/60 border border-tactical-border backdrop-blur-md rounded-md p-2 max-w-xs">
                        <div className="flex items-center gap-2 mb-2 text-tactical-cyan">
                            <Activity className="w-3 h-3" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Analysis</span>
                        </div>
                        <p className="text-[10px] font-mono text-tactical-text leading-relaxed">
                            &gt;&gt; MOVEMENT DETECTED<br />
                            &gt;&gt; POSTURE: UNSTABLE<br />
                            &gt;&gt; CONFIDENCE: 98.4%
                        </p>
                    </div>
                </div>

                {/* Video Placeholder */}
                <div className="w-full h-full bg-neutral-900 relative">
                    <img
                        src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop"
                        alt="Patient Room Feed"
                        className="w-full h-full object-cover opacity-60 grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-tactical-cyan/5 mix-blend-overlay pointer-events-none"></div>
                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50"></div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 right-8 z-20">
                    <button className="p-2 bg-black/60 border border-tactical-border hover:border-tactical-cyan text-tactical-text hover:text-tactical-cyan rounded-md transition-all">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
