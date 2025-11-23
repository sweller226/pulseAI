# PatientPulse

Real-time patient monitoring system with AI-powered vital sign analysis and automated emergency response.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Latest-000000?logo=flask)](https://flask.palletsprojects.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## Overview

PatientPulse is a healthcare monitoring platform that provides continuous vital sign tracking, facial expression analysis, and intelligent emergency response coordination. The system combines computer vision, machine learning, and telecommunications to enable real-time patient assessment and automated intervention protocols.

## System Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI[User Interface]
        API_Client[API Client]
        Charts[Real-time Charts]
        Alerts[Alert System]
    end

    subgraph Backend["Backend (Flask)"]
        Routes[API Routes]
        VM[Vitals Monitor]
        AM[Alert Manager]
        EA[Emotion Analyzer]
        AH[Action Handler]
    end

    subgraph External["External Services"]
        Gemini[Google Gemini AI]
        ElevenLabs[ElevenLabs Voice]
        Twilio[Twilio SMS/Voice]
    end

    subgraph Hardware["Hardware"]
        Camera[Webcam]
        Sensors[Vital Sign Sensors]
    end

    UI --> API_Client
    API_Client --> Routes
    Routes --> VM
    Routes --> EA
    VM --> AM
    AM --> AH
    EA --> Camera
    VM --> Sensors
    AM --> ElevenLabs
    AH --> Twilio
    Routes --> Gemini
    
    Routes --> API_Client
    API_Client --> Charts
    API_Client --> Alerts

    style Frontend fill:#e1f5ff
    style Backend fill:#fff4e1
    style External fill:#f0e1ff
    style Hardware fill:#e1ffe1
```

## Key Features

- Continuous vital sign monitoring (heart rate, respiratory rate)
- Facial expression recognition for mood and distress detection
- Automated anomaly detection with configurable thresholds
- Emergency alert system with audio and visual notifications
- AI-powered voice conversation for patient assessment
- Comprehensive medical record management
- Real-time data visualization with historical trending

## Alert Processing Workflow

```mermaid
sequenceDiagram
    participant VS as Vital Sensors
    participant VM as Vitals Monitor
    participant AM as Alert Manager
    participant EL as ElevenLabs AI
    participant AH as Action Handler
    participant TW as Twilio API
    participant UI as Frontend UI

    VS->>VM: Stream vital signs
    VM->>VM: Analyze thresholds
    
    alt Abnormal Pattern Detected
        VM->>AM: trigger_alert()
        AM->>AM: Check for duplicates
        AM->>EL: Start voice conversation
        EL->>EL: Assess patient condition
        EL-->>AM: Conversation result
        AM->>AH: handle_action(result)
        
        alt Emergency Required
            AH->>TW: Call 911
            TW-->>AH: Call initiated
        else Family Contact
            AH->>TW: Call family
            TW-->>AH: Call initiated
        end
        
        AM->>UI: Alert active status
        UI->>UI: Display emergency overlay
    end
    
    VM->>UI: Update vital signs
    UI->>UI: Render real-time graphs
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph Input["Data Input Layer"]
        Camera[Webcam Feed]
        Vitals[Vital Sensors]
    end

    subgraph Processing["Processing Layer"]
        FER[Facial Expression<br/>Recognition]
        Threshold[Threshold<br/>Analysis]
        ML[Machine Learning<br/>Models]
    end

    subgraph Logic["Business Logic Layer"]
        Monitor[Vitals Monitor]
        AlertMgr[Alert Manager]
        ActionHdlr[Action Handler]
    end

    subgraph API["API Layer"]
        Routes[REST Endpoints]
        CORS[CORS Handler]
    end

    subgraph Frontend["Presentation Layer"]
        Dashboard[Dashboard UI]
        Graphs[Real-time Graphs]
        Emergency[Emergency Alerts]
    end

    Camera --> FER
    Vitals --> Threshold
    FER --> ML
    Threshold --> Monitor
    ML --> Monitor
    Monitor --> AlertMgr
    AlertMgr --> ActionHdlr
    Monitor --> Routes
    AlertMgr --> Routes
    Routes --> CORS
    CORS --> Dashboard
    Dashboard --> Graphs
    Dashboard --> Emergency

    style Input fill:#e1ffe1
    style Processing fill:#ffe1e1
    style Logic fill:#fff4e1
    style API fill:#e1f5ff
    style Frontend fill:#f0e1ff
```

## Technology Stack

### Frontend

| Component | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tooling and development server |
| TypeScript | 5.8 | Static type checking |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| Radix UI | Latest | Accessible component primitives |
| Recharts | 2.15 | Chart library for data visualization |
| TanStack Query | 5.83 | Asynchronous state management |
| React Router | 6.30 | Client-side routing |

### Backend

| Component | Version | Purpose |
|-----------|---------|---------|
| Flask | Latest | Python web framework |
| Google Gemini AI | Latest | Natural language processing |
| TensorFlow | Latest | Machine learning framework |
| FER | Latest | Facial emotion recognition library |
| OpenCV | Latest | Computer vision operations |
| Twilio | 9.0.4 | SMS and voice communication |
| Flask-CORS | Latest | Cross-origin resource sharing |

## Component Interaction Map

```mermaid
graph TD
    subgraph Frontend_Components["Frontend Components"]
        Dashboard[Dashboard.tsx]
        EmergencyAlert[EmergencyAlert.tsx]
        VitalGraph[VitalGraphCard.tsx]
        PatientInfo[PatientInfo.tsx]
        PatientHistory[PatientHistory.tsx]
        MoodCard[MoodCard.tsx]
    end

    subgraph API_Layer["API Communication"]
        useVitals[useVitals hook]
        useAlert[useAlert hook]
        ApiService[ApiService class]
    end

    subgraph Backend_Services["Backend Services"]
        Routes[routes.py]
        VitalsMonitor[vitals_monitor.py]
        AlertManager[alert_manager.py]
        EmotionAnalyzer[emotion_analyzer.py]
        ActionHandler[action_handler.py]
    end

    Dashboard --> useVitals
    Dashboard --> useAlert
    Dashboard --> EmergencyAlert
    Dashboard --> VitalGraph
    Dashboard --> PatientInfo
    Dashboard --> MoodCard
    
    useVitals --> ApiService
    useAlert --> ApiService
    ApiService --> Routes
    
    Routes --> VitalsMonitor
    Routes --> AlertManager
    Routes --> EmotionAnalyzer
    VitalsMonitor --> AlertManager
    AlertManager --> ActionHandler

    style Frontend_Components fill:#e1f5ff
    style API_Layer fill:#fff4e1
    style Backend_Services fill:#f0e1ff
```

## Prerequisites

- Node.js 18.0 or higher
- Python 3.10 or higher
- Webcam device for facial analysis
- Google Gemini API credentials
- Twilio account for emergency communications

## Installation

### Backend Configuration

```bash
cd backend/gemini

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API credentials
```

Required environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Frontend Configuration

```bash
cd frontend

# Install dependencies
npm install

# Development server will proxy to http://localhost:5000
```

## Running the Application

Start the backend server:
```bash
cd backend/gemini
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

In a separate terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`, with the API running at `http://localhost:5000`.

## API Documentation

### Vital Signs Endpoints

**GET** `/api/vitals/current`  
Returns current vital signs and emotion analysis data.

Response:
```json
{
  "pulse_rate": 72,
  "breathing_rate": 16,
  "timestamp": "2024-11-23T12:00:00Z",
  "emotion": {
    "dominant": "neutral",
    "confidence": 0.85
  },
  "emotion_summary": "Patient appears calm"
}
```

**GET** `/api/vitals/history?limit=<n>`  
Returns historical vital sign records.

### Alert Management Endpoints

**GET** `/api/alerts/active`  
Returns current alert status.

Response:
```json
{
  "active": true,
  "alert_id": "alert_123456",
  "triggered_at": "2024-11-23T12:00:00Z"
}
```

**GET** `/api/alerts/history`  
Returns historical alert records.

### System Health Endpoint

**GET** `/api/health`  
Returns API health status and version information.

## System Operation

### Monitoring State Machine

```mermaid
stateDiagram-v2
    [*] --> Normal: System Start
    Normal --> Monitoring: Vitals Stable
    Monitoring --> Warning: Threshold Exceeded
    Warning --> Monitoring: Values Normalize
    Warning --> Critical: Prolonged Abnormality
    Critical --> AlertActive: trigger_alert()
    AlertActive --> VoiceConversation: Start AI Assessment
    VoiceConversation --> ActionRequired: Patient Response
    ActionRequired --> Emergency911: Critical Response
    ActionRequired --> FamilyContact: Non-Critical
    ActionRequired --> NoAction: False Alarm
    Emergency911 --> Resolved
    FamilyContact --> Resolved
    NoAction --> Resolved
    Resolved --> Monitoring: Alert Cleared
    Monitoring --> Normal: Extended Stability
```

### Frontend Operation

- Polls `/api/vitals/current` every 2 seconds
- Maintains rolling 30-point history for graph rendering
- Displays real-time updates with fixed Y-axis scaling
- Triggers emergency UI overlay when alerts are active
- Enforces minimum 5-second alert display duration

## UI Components

### Emergency Alert System

The emergency alert component provides a full-screen notification overlay with the following characteristics:
- Modal overlay with backdrop blur effect
- Pulsing visual indicators for urgency
- Audio notification on alert activation
- Minimum display duration of 5 seconds
- Real-time vital sign display within alert

### Real-Time Monitoring Graphs

- Fixed Y-axis domains for consistent medical reference
- Scrolling data display (newest right, oldest left)
- 30-point rolling history window
- Color-coded status indicators (normal, warning, critical)
- No X-axis labels for cleaner presentation

### Patient Information View

Organized in a 3x2 grid layout containing:
- Medical conditions with status indicators
- Current medications and dosing schedules
- Recent medical history and appointments
- Emergency contact information
- 24-hour vital statistics and lab results
- AI-generated insights and risk assessment

## Performance Metrics

```mermaid
pie title "System Resource Distribution"
    "Frontend Rendering" : 35
    "API Communication" : 20
    "ML Processing" : 25
    "Alert Management" : 15
    "Data Storage" : 5
```

## Development

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

### Code Organization

The codebase follows these organizational principles:
- Frontend: Component-based architecture with atomic design patterns
- Backend: Service-oriented architecture with clear separation of concerns
- API: RESTful design with versioned endpoints
- State Management: Server state via TanStack Query, local state via React hooks

## Troubleshooting

**Backend Connection Issues**
- Verify Flask server is running on port 5000
- Check CORS configuration in `main.py`
- Confirm firewall rules allow local connections

**Webcam Access Problems**
- Grant camera permissions in browser settings
- Verify no other applications are using the webcam
- Check camera device drivers are installed

**Alert System Not Triggering**
- Review threshold configurations in `vitals_monitor.py`
- Check application logs for error messages
- Verify abnormal vital signs are being detected

## Production Deployment

```mermaid
graph LR
    subgraph Development
        DevFE[Frontend Dev]
        DevBE[Backend Dev]
    end

    subgraph Build
        BuildFE[npm run build]
        BuildBE[Docker Build]
    end

    subgraph Deploy
        Nginx[Nginx Reverse Proxy]
        Gunicorn[Gunicorn WSGI]
        Static[Static Assets CDN]
    end

    subgraph Monitor
        Logs[Log Aggregation]
        Metrics[Performance Metrics]
        Alerts[System Alerts]
    end

    DevFE --> BuildFE
    DevBE --> BuildBE
    BuildFE --> Static
    BuildBE --> Gunicorn
    Static --> Nginx
    Gunicorn --> Nginx
    Nginx --> Logs
    Nginx --> Metrics
    Metrics --> Alerts

    style Development fill:#e1f5ff
    style Build fill:#fff4e1
    style Deploy fill:#f0e1ff
    style Monitor fill:#ffe1e1
```

For production environments:
- Use a production-grade WSGI server (Gunicorn, uWSGI)
- Configure reverse proxy (Nginx, Apache)
- Enable HTTPS with valid SSL certificates
- Implement proper logging and monitoring
- Set up database persistence for historical data
- Configure automated backups
- Implement rate limiting and authentication

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contributing

Contributions should follow these guidelines:
1. Fork the repository
2. Create a feature branch from `main`
3. Follow existing code style and conventions
4. Include tests for new functionality
5. Update documentation as needed
6. Submit pull request with clear description

## Technical Support

For technical issues or questions, please open an issue on the project repository with:
- Detailed description of the problem
- Steps to reproduce
- System environment details
- Relevant log output
