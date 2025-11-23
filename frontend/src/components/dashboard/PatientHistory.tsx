import React from 'react';
import { User, AlertTriangle, Pill, Activity, Phone, Heart, Brain, Zap, Shield, TrendingUp, Calendar } from 'lucide-react';

export const PatientHistory = () => {
    return (
        <div className="h-full flex flex-col gap-4 animate-fade-in">
            {/* Profile Header */}
            <div className="glass-panel p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent" />

                <div className="relative flex items-center gap-6">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 p-1">
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                            <User className="w-14 h-14 text-purple-300" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-1">John Doe</h2>
                                <p className="text-sm text-gray-400">Patient ID: #8492-TX</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow" />
                                    ACTIVE MONITORING
                                </div>
                                <div className="px-4 py-2 glass-effect rounded-lg flex items-center gap-2 text-xs text-purple-300">
                                    <Brain className="w-4 h-4" />
                                    AI Analysis Active
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <div className="glass-effect p-3 rounded-lg hover:bg-white/5 transition-smooth">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Age / Gender</div>
                                <div className="text-sm font-semibold text-white">45 / Male</div>
                            </div>
                            <div className="glass-effect p-3 rounded-lg hover:bg-white/5 transition-smooth">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Blood Type</div>
                                <div className="text-sm font-semibold text-white">O-Negative</div>
                            </div>
                            <div className="glass-effect p-3 rounded-lg hover:bg-white/5 transition-smooth">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last Check</div>
                                <div className="text-sm font-semibold text-emerald-400">2 mins ago</div>
                            </div>
                            <div className="glass-effect p-3 rounded-lg hover:bg-white/5 transition-smooth">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Health Score</div>
                                <div className="text-sm font-semibold text-purple-400">92/100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Left Column - 3 Equal Cards */}
                <div className="grid grid-rows-3 gap-4">
                    <CardMedical />
                    <CardMedications />
                    < CardHistory />
                </div>

                {/* Right Column - 3 Equal Cards */}
                <div className="grid grid-rows-3 gap-4">
                    <CardContacts />
                    <CardVitals />
                    <CardAI />
                </div>
            </div>
        </div>
    );
};

const CardMedical = () => (
    <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> Medical Info
        </h3>
        <div className="space-y-3 mb-4">
            <div className="glass-effect p-2 rounded border border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Post-Op Recovery</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] rounded">Monitoring</span>
                </div>
            </div>
            <div className="glass-effect p-2 rounded border border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Hypertension</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] rounded">Controlled</span>
                </div>
            </div>
        </div>
        <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] text-gray-400 uppercase mb-2">Allergies</div>
            <div className="flex gap-2">
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Penicillin
                </span>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] rounded">Shellfish</span>
            </div>
        </div>
    </div>
);

const CardMedications = () => (
    <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-400" /> Medications
        </h3>
        <div className="space-y-2">
            {['Lisinopril - 10mg', 'Metformin - 500mg', 'Atorvastatin - 20mg'].map((med, i) => (
                <div key={i} className="glass-effect p-2 rounded border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white">{med}</span>
                    <span className="text-[9px] text-blue-400">Daily</span>
                </div>
            ))}
        </div>
    </div>
);

const CardHistory = () => (
    <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Medical History
        </h3>
        <div className="space-y-2">
            {[{ name: 'Surgery - Appendectomy', date: 'Nov 15' }, { name: 'Annual Check-up', date: 'Aug 3' }].map((item, i) => (
                <div key={i} className="glass-effect p-2 rounded border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white font-semibold">{item.name}</span>
                        <span className="text-[10px] text-gray-400">{item.date}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CardContacts = () => (
    <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" /> Emergency Contacts
        </h3>
        <div className="space-y-3">
            <div className="glass-effect p-2 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">Jane Doe</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] rounded">Primary</span>
                </div>
                <div className="text-[10px] text-gray-400">Daughter | (555) 123-4567</div>
            </div>
            <div className="glass-effect p-2 rounded border border-white/5">
                <div className="text-xs font-semibold text-white mb-1">Dr. Silberman</div>
                <div className="text-[10px] text-gray-400">Cardiologist | (555) 987-6543</div>
            </div>
        </div>
    </div>
);

const CardVitals = () => (
    <div className="glass-panel p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" /> 24hr Vitals & Labs
        </h3>
        <div className="space-y-2 mb-4">
            {[{ label: 'Avg Heart Rate', value: '74 BPM' }, { label: 'Avg Breathing', value: '16 RPM' }, { label: 'System Uptime', value: '99.8%', special: true }].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{item.label}</span>
                    <span className={item.special ? 'text-emerald-400 font-semibold' : 'text-white font-semibold'}>{item.value}</span>
                </div>
            ))}
        </div>
        <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] text-gray-400 uppercase mb-2">Recent Labs</div>
            <div className="space-y-1 text-[10px]">
                {[{ name: 'Blood Glucose', val: '95 mg/dL' }, { name: 'Cholesterol', val: '180 mg/dL' }].map((lab, i) => (
                    <div key={i} className="flex justify-between">
                        <span className="text-gray-300">{lab.name}</span>
                        <span className="text-white">{lab.val}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CardAI = () => (
    <div className="glass-panel p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" /> AI Insights & Risk
        </h3>
        <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-[10px]">
                <Brain className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Vitals <span className="text-emerald-400 font-semibold">within normal range</span></p>
            </div>
            <div className="flex items-start gap-2 text-[10px]">
                <TrendingUp className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Recovery <span className="text-blue-400 font-semibold">15% better</span> than expected</p>
            </div>
        </div>
        <div className="pt-3 border-t border-white/10 mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-gray-400">Overall Risk</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400">Low (25%)</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '25%' }} />
            </div>
        </div>
        <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] text-gray-400 uppercase mb-2">Insurance</div>
            <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                    <span className="text-gray-400">Provider</span>
                    <span className="text-white">BCBS</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Policy</span>
                    <span className="text-white font-mono">ABC123456789</span>
                </div>
            </div>
        </div>
    </div>
);
