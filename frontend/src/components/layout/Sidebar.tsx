import React from 'react';
import { Activity, Clock, Phone, AlertCircle } from 'lucide-react';

export const Sidebar = () => {
    return (
        <div className="sidebar-col">
            {/* Patient Identity Card */}
            <div className="glass-panel identity-card">
                <div className="patient-header">
                    <div className="avatar-placeholder">JD</div>
                    <div className="patient-info">
                        <h2>John Doe</h2>
                        <span className="id-badge">ID: 84432-TX</span>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Age / Sex</label>
                        <span>45 / Male</span>
                    </div>
                    <div className="info-item">
                        <label>Blood Type</label>
                        <span>O+</span>
                    </div>
                    <div className="info-item">
                        <label>Height</label>
                        <span>182 cm</span>
                    </div>
                    <div className="info-item">
                        <label>Weight</label>
                        <span>85 kg</span>
                    </div>
                </div>
            </div>

            {/* Medical History Module */}
            <div className="glass-panel history-module">
                <div className="module-title">
                    <AlertCircle className="w-3 h-3" />
                    Medical History
                </div>
                <div className="history-list">
                    <div className="history-item">
                        <span className="history-label">Condition</span>
                        <span className="history-value">Hypertension</span>
                    </div>
                    <div className="history-item">
                        <span className="history-label">Status</span>
                        <span className="tag warning">Post-Op Day 2</span>
                    </div>
                </div>
            </div>

            {/* Medications Module */}
            <div className="glass-panel history-module">
                <div className="module-title">
                    <Activity className="w-3 h-3" />
                    Active Medications
                </div>
                <div className="history-list">
                    <div className="history-item">
                        <span className="history-label">Lisinopril</span>
                        <span className="history-value">10mg Daily</span>
                    </div>
                    <div className="history-item">
                        <span className="history-label">Penicillin</span>
                        <span className="tag warning">ALLERGY</span>
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-panel history-module">
                <div className="module-title">
                    <Phone className="w-3 h-3" />
                    Emergency Contact
                </div>
                <div className="history-list">
                    <div className="history-item">
                        <span className="history-label">Jane Doe</span>
                        <span className="history-value">Wife</span>
                    </div>
                    <div className="history-item">
                        <span className="history-label">Phone</span>
                        <span className="history-value">+1 (555) 012-3456</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav-menu">
                <a href="#overview" className="nav-link active">
                    <Activity className="w-4 h-4" />
                    <span>Overview</span>
                </a>
                <a href="#history" className="nav-link">
                    <Clock className="w-4 h-4" />
                    <span>Full History</span>
                </a>
            </nav>
        </div>
    );
};
