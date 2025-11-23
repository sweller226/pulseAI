// API Types based on Flask backend responses

export interface VitalsResponse {
    pulse_rate: number;
    breathing_rate: number;
    pulse_confidence: number;
    breathing_confidence: number;
    talking: boolean;
    timestamp: string;
    status: string;
    emotion: {
        dominant: string;
        confidence?: number;
        details: Record<string, any>;
    };
    emotion_summary: string;
    alert_active: boolean;
    is_abnormal: boolean;
    abnormal_duration: number;
}

export interface AlertResponse {
    alert_active: boolean;
    message?: string;
}

export interface HealthResponse {
    status: string;
    vitals_status: string;
    alert_status: string;
    monitoring_info: Record<string, any>;
}

export interface EmergencyCallRequest {
    to: string;
    name?: string;
    address?: string;
    incident?: string;
    heartrate?: string;
    breathing?: string;
    emotion?: string;
    severity?: string;
}

export interface EmergencyCallResponse {
    success: boolean;
    call_sid?: string;
    to?: string;
    status?: string;
    greeting?: string;
    error?: string;
}

// API Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Get current vitals
    async getCurrentVitals(): Promise<VitalsResponse> {
        const response = await fetch(`${this.baseUrl}/api/vitals/current`);
        if (!response.ok) {
            throw new Error(`Failed to fetch vitals: ${response.statusText}`);
        }
        return response.json();
    }

    // Check if alert is active
    async getAlertStatus(): Promise<AlertResponse> {
        const response = await fetch(`${this.baseUrl}/api/alerts/active`);
        if (!response.ok) {
            throw new Error(`Failed to fetch alert status: ${response.statusText}`);
        }
        return response.json();
    }

    // Get health status
    async getHealth(): Promise<HealthResponse> {
        const response = await fetch(`${this.baseUrl}/health`);
        if (!response.ok) {
            throw new Error(`Failed to fetch health: ${response.statusText}`);
        }
        return response.json();
    }

    // Trigger test emergency
    async triggerTestEmergency(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/emergency/test-trigger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to trigger emergency: ${response.statusText}`);
        }
        return response.json();
    }

    // Make emergency call
    async makeEmergencyCall(data: EmergencyCallRequest): Promise<EmergencyCallResponse> {
        const response = await fetch(`${this.baseUrl}/make_call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to make emergency call: ${response.statusText}`);
        }
        return response.json();
    }
}

export const api = new ApiService(API_BASE_URL);
