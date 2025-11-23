import React from 'react';
import { Calendar, Clock, Activity, Phone, CheckCircle, FileText, User, AlertTriangle } from 'lucide-react';

export const IncidentReport = () => {
    return (
        <div className="h-full flex flex-col gap-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 glass-panel">
                <div>
                    <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                        INCIDENT #1763858165
                        <span className="px-2 py-0.5 bg-tactical-red/20 border border-tactical-red text-tactical-red text-xs rounded-full">CRITICAL</span>
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-xs font-mono text-tactical-textMuted">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Nov 22, 2025</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10:42 PM</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> Sarah Connor</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-tactical-cyan/10 hover:bg-tactical-cyan/20 border border-tactical-cyan text-tactical-cyan text-xs font-mono font-bold rounded-md transition-colors">
                        DOWNLOAD REPORT
                    </button>
                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-tactical-text text-xs font-mono font-bold rounded-md transition-colors">
                        MARK REVIEWED
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Left Column: Details & Vitals */}
                <div className="flex flex-col gap-4">
                    <div className="glass-panel p-4">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Vitals Snapshot
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-black/40 rounded-md border border-tactical-red/30">
                                <div className="text-[10px] text-tactical-textMuted mb-1">HEART RATE</div>
                                <div className="text-xl font-mono font-bold text-tactical-red">150 BPM</div>
                                <div className="text-[10px] text-tactical-red mt-1">CRITICAL (+35%)</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-md border border-tactical-amber/30">
                                <div className="text-[10px] text-tactical-textMuted mb-1">RESPIRATION</div>
                                <div className="text-xl font-mono font-bold text-tactical-amber">30 RPM</div>
                                <div className="text-[10px] text-tactical-amber mt-1">ELEVATED</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-md border border-white/10">
                                <div className="text-[10px] text-tactical-textMuted mb-1">BLOOD PRESSURE</div>
                                <div className="text-xl font-mono font-bold text-tactical-text">145/95</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-md border border-white/10">
                                <div className="text-[10px] text-tactical-textMuted mb-1">OXYGEN SAT</div>
                                <div className="text-xl font-mono font-bold text-tactical-text">96%</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4 flex-1">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Actions Taken
                        </h3>
                        <div className="space-y-4 relative pl-2">
                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10"></div>
                            <ActionItem time="10:42:15" text="Fall Detected by AI Vision System" />
                            <ActionItem time="10:42:18" text="Automated Voice Inquiry Initiated" />
                            <ActionItem time="10:42:30" text="Patient Response: 'Call Family'" />
                            <ActionItem time="10:42:35" text="Emergency Contact (Jane Doe) Dialed" />
                            <ActionItem time="10:46:00" text="Family Confirmed En Route" />
                            <ActionItem time="10:50:00" text="Incident Resolved - Patient Stabilized" active />
                        </div>
                    </div>
                </div>

                {/* Right Column: Transcript */}
                <div className="glass-panel p-4 flex flex-col">
                    <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> AI Conversation Transcript
                    </h3>
                    <div className="flex-1 bg-black/40 rounded-md border border-white/5 p-4 overflow-y-auto custom-scrollbar space-y-4 font-mono text-sm">
                        <ChatMessage sender="AI" time="10:42:18" text="Sarah, I detected a fall. Are you okay?" />
                        <ChatMessage sender="Patient" time="10:42:25" text="..." />
                        <ChatMessage sender="AI" time="10:42:28" text="Sarah, please respond. Do you need assistance?" />
                        <ChatMessage sender="Patient" time="10:42:30" text="Yes... I slipped. Call Jane." />
                        <ChatMessage sender="AI" time="10:42:32" text="Understood. Calling Jane Doe now." />
                        <div className="flex justify-center my-4">
                            <span className="text-[10px] text-tactical-textMuted px-2 py-1 bg-white/5 rounded-full">CALL CONNECTED (03:15)</span>
                        </div>
                        <ChatMessage sender="Jane (Family)" time="10:42:45" text="Mom? I'm on my way!" />
                        <ChatMessage sender="Patient" time="10:42:50" text="Okay... I'll stay here." />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionItem = ({ time, text, active }: { time: string, text: string, active?: boolean }) => (
    <div className="relative pl-6">
        <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-tactical-bg ${active ? 'bg-tactical-emerald' : 'bg-tactical-textMuted'} z-10`}></div>
        <div className="text-[10px] font-mono text-tactical-textMuted mb-0.5">{time}</div>
        <div className={`text-xs font-mono ${active ? 'text-tactical-emerald font-bold' : 'text-tactical-text'}`}>{text}</div>
    </div>
);

const ChatMessage = ({ sender, time, text }: { sender: string, time: string, text: string }) => {
    const isAI = sender === 'AI';
    return (
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold ${isAI ? 'text-tactical-cyan' : 'text-tactical-purple'}`}>{sender}</span>
                <span className="text-[10px] text-tactical-textMuted">{time}</span>
            </div>
            <div className={`p-3 rounded-lg max-w-[80%] ${isAI ? 'bg-tactical-cyan/10 border border-tactical-cyan/20 text-tactical-cyan' : 'bg-white/5 border border-white/10 text-tactical-text'}`}>
                {text}
            </div>
        </div>
    );
};
