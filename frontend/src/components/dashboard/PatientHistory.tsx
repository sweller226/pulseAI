import React from 'react';
import { User, AlertTriangle, Pill, Activity, Phone, FileText } from 'lucide-react';

export const PatientHistory = () => {
    return (
        <div className="h-full flex flex-col gap-4 animate-fade-in">
            {/* Profile Header */}
            <div className="glass-panel p-6 flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-tactical-cyan to-tactical-purple p-[2px]">
                    <div className="w-full h-full rounded-xl bg-black flex items-center justify-center overflow-hidden">
                        <User className="w-12 h-12 text-white/50" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-mono font-bold text-white tracking-wide">SARAH CONNOR</h2>
                        <div className="px-3 py-1 bg-tactical-emerald/10 border border-tactical-emerald text-tactical-emerald text-xs font-mono font-bold rounded-full">
                            ACTIVE MONITORING
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm font-mono text-tactical-textMuted">
                        <div>ID: <span className="text-white">#8492-TX</span></div>
                        <div>DOB: <span className="text-white">1965-05-12 (64)</span></div>
                        <div>BLOOD: <span className="text-white">O-NEG</span></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Left Col: Medical Info */}
                <div className="space-y-4">
                    <div className="glass-panel p-4">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Medical Conditions
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm font-mono text-white">
                                <div className="w-1.5 h-1.5 bg-tactical-red rounded-full"></div>
                                Hypertension (Diagnosed 2020)
                            </li>
                            <li className="flex items-center gap-2 text-sm font-mono text-white">
                                <div className="w-1.5 h-1.5 bg-tactical-amber rounded-full"></div>
                                Type 2 Diabetes (Managed)
                            </li>
                        </ul>
                    </div>

                    <div className="glass-panel p-4">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Allergies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-tactical-red/10 border border-tactical-red/30 text-tactical-red text-xs font-mono rounded-md">Penicillin (Severe)</span>
                            <span className="px-2 py-1 bg-tactical-amber/10 border border-tactical-amber/30 text-tactical-amber text-xs font-mono rounded-md">Shellfish (Mild)</span>
                        </div>
                    </div>
                </div>

                {/* Right Col: Medications & Contacts */}
                <div className="space-y-4">
                    <div className="glass-panel p-4">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Pill className="w-3 h-3" /> Current Medications
                        </h3>
                        <div className="space-y-3">
                            <MedicationItem name="Lisinopril" dose="10mg" freq="Daily" />
                            <MedicationItem name="Metformin" dose="500mg" freq="Twice Daily" />
                            <MedicationItem name="Atorvastatin" dose="20mg" freq="Daily" />
                        </div>
                    </div>

                    <div className="glass-panel p-4">
                        <h3 className="text-xs font-mono text-tactical-textMuted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Emergency Contacts
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/5">
                                <div>
                                    <div className="text-xs font-bold text-white">Jane Doe (Daughter)</div>
                                    <div className="text-[10px] text-tactical-textMuted">Primary Contact</div>
                                </div>
                                <div className="text-xs font-mono text-tactical-cyan">(555) 123-4567</div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/5">
                                <div>
                                    <div className="text-xs font-bold text-white">Dr. Silberman</div>
                                    <div className="text-[10px] text-tactical-textMuted">Cardiologist</div>
                                </div>
                                <div className="text-xs font-mono text-tactical-cyan">(555) 987-6543</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MedicationItem = ({ name, dose, freq }: { name: string, dose: string, freq: string }) => (
    <div className="flex items-center justify-between p-2 bg-white/5 rounded-md border border-white/5">
        <div>
            <div className="text-xs font-bold text-white">{name}</div>
            <div className="text-[10px] text-tactical-textMuted">{dose}</div>
        </div>
        <div className="text-[10px] font-mono text-tactical-cyan bg-tactical-cyan/10 px-2 py-1 rounded-full">{freq}</div>
    </div>
);

const HistoryItem = ({ date, title, type }: { date: string, title: string, type: 'info' | 'success' | 'warning' | 'critical' }) => {
    const colors = {
        info: 'border-white/10 text-tactical-textMuted',
        success: 'border-tactical-emerald/30 text-tactical-emerald',
        warning: 'border-tactical-amber/30 text-tactical-amber',
        critical: 'border-tactical-red/30 text-tactical-red'
    };

    return (
        <div className={`p-3 rounded-md border bg-black/20 flex items-center justify-between ${colors[type]}`}>
            <span className="text-xs font-bold">{title}</span>
            <span className="text-[10px] font-mono opacity-70">{date}</span>
        </div>
    );
};
