import { useState, useEffect } from "react";
import { Heart, Waves, Gauge, Activity, Phone, Play, Pause, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { VitalSignCard } from "@/components/VitalSignCard";
import { WebcamFeed } from "@/components/WebcamFeed";
import { AlertCard } from "@/components/AlertCard";
import { FullEventLog } from "@/components/FullEventLog";
import { VitalSignsChart } from "@/components/VitalSignsChart";
import { AIChat } from "@/components/AIChat";

interface LogMessage {
  id: string;
  content: string;
  timestamp: Date;
  severity?: "info" | "warning" | "critical";
}

interface VitalDataPoint {
  timestamp: number;
  time: string;
  heartRate: number;
  breathingRate: number;
  systolic: number;
  diastolic: number;
}

const Index = () => {
  // Simulated real-time data (replace with actual data sources)
  const [heartRate, setHeartRate] = useState(72);
  const [breathingRate, setBreathingRate] = useState(16);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [healthLevel, setHealthLevel] = useState(85);
  const [hasFallen, setHasFallen] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState<"low" | "medium" | "high">("low");
  const [hasAnxiety, setHasAnxiety] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [vitalHistory, setVitalHistory] = useState<VitalDataPoint[]>([]);
  const [show911Dialog, setShow911Dialog] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isHomeMode, setIsHomeMode] = useState(false);
  const [eventLogs, setEventLogs] = useState<LogMessage[]>(() => {
    // Initialize from sessionStorage if available
    const stored = sessionStorage.getItem("eventLogs");
    if (stored) {
      try {
        return JSON.parse(stored).map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      } catch {
        return [
          {
            id: "init",
            content: "System initialized and monitoring active",
            timestamp: new Date(),
            severity: "info",
          },
        ];
      }
    }
    return [
      {
        id: "init",
        content: "System initialized and monitoring active",
        timestamp: new Date(),
        severity: "info",
      },
    ];
  });

  // Simulate real-time data updates with occasional alerts
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Simulate slight variations in vital signs with occasional spikes
      setHeartRate((prev) => {
        const random = Math.random();
        // 25% chance of spike to trigger alerts
        if (random < 0.25) {
          return Math.max(50, Math.min(150, prev + (Math.random() > 0.5 ? 40 : -30)));
        }
        const change = (Math.random() - 0.5) * 4;
        return Math.max(60, Math.min(100, prev + change));
      });

      setBreathingRate((prev) => {
        const random = Math.random();
        // 20% chance of spike
        if (random < 0.2) {
          return Math.max(10, Math.min(35, prev + (Math.random() > 0.5 ? 12 : -10)));
        }
        const change = (Math.random() - 0.5) * 2;
        return Math.max(12, Math.min(20, prev + change));
      });

      setBloodPressure((prev) => {
        const random = Math.random();
        // 30% chance of spike
        if (random < 0.3) {
          return {
            systolic: Math.max(80, Math.min(200, prev.systolic + (Math.random() > 0.5 ? 50 : -40))),
            diastolic: Math.max(50, Math.min(140, prev.diastolic + (Math.random() > 0.5 ? 35 : -30))),
          };
        }
        return {
          systolic: Math.max(100, Math.min(140, prev.systolic + (Math.random() - 0.5) * 5)),
          diastolic: Math.max(60, Math.min(90, prev.diastolic + (Math.random() - 0.5) * 3)),
        };
      });

      // 20% chance of fall detection
      if (Math.random() < 0.2) {
        setHasFallen(true);
      } else {
        setHasFallen(false);
      }

      // 25% chance of anxiety spike
      if (Math.random() < 0.25) {
        const levels: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];
        setAnxietyLevel(levels[Math.floor(Math.random() * levels.length)]);
        setHasAnxiety(true);
      } else {
        setHasAnxiety(false);
      }
    }, 2000); // Changed to 2 seconds for faster simulation

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Record vital signs history
  useEffect(() => {
    setVitalHistory((prev) => {
      const newPoint: VitalDataPoint = {
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        heartRate: Math.round(heartRate),
        breathingRate: Math.round(breathingRate),
        systolic: Math.round(bloodPressure.systolic),
        diastolic: Math.round(bloodPressure.diastolic),
      };
      return [...prev, newPoint].slice(-120); // Keep last 120 data points
    });
  }, [heartRate, breathingRate, bloodPressure]);

  // Monitor vital signs and log alerts
  useEffect(() => {
    const checkVitals = () => {
      const newLogs: LogMessage[] = [];
      let isDangerous = false;

      // Check heart rate - dangerous: < 60 or > 110
      if (heartRate < 60 || heartRate > 110) {
        isDangerous = true;
        if (heartRate < 60) {
          newLogs.push({
            id: `hr-low-${Date.now()}`,
            content: `🚨 DANGEROUS: Low heart rate detected: ${Math.round(heartRate)} BPM`,
            timestamp: new Date(),
            severity: "critical",
          });
        } else if (heartRate > 110) {
          newLogs.push({
            id: `hr-high-${Date.now()}`,
            content: `🚨 DANGEROUS: HIGH heart rate detected: ${Math.round(heartRate)} BPM`,
            timestamp: new Date(),
            severity: "critical",
          });
        }
      }

      // Check breathing rate - dangerous: < 12 or > 20
      if (breathingRate < 12 || breathingRate > 20) {
        isDangerous = true;
        if (breathingRate < 12) {
          newLogs.push({
            id: `br-low-${Date.now()}`,
            content: `🚨 DANGEROUS: Low breathing rate detected: ${Math.round(breathingRate)} BrPM`,
            timestamp: new Date(),
            severity: "critical",
          });
        } else if (breathingRate > 20) {
          newLogs.push({
            id: `br-high-${Date.now()}`,
            content: `🚨 DANGEROUS: HIGH breathing rate detected: ${Math.round(breathingRate)} BrPM`,
            timestamp: new Date(),
            severity: "critical",
          });
        }
      }

      // Check blood pressure - dangerous: (sys > 140 OR dia > 90) OR (sys < 90 OR dia < 60)
      const isBPDangerous = 
        (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) ||
        (bloodPressure.systolic < 90 || bloodPressure.diastolic < 60);
      
      if (isBPDangerous) {
        isDangerous = true;
        if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
          newLogs.push({
            id: `bp-high-${Date.now()}`,
            content: `🚨 DANGEROUS: High blood pressure: ${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)} mmHg`,
            timestamp: new Date(),
            severity: "critical",
          });
        } else if (bloodPressure.systolic < 90 || bloodPressure.diastolic < 60) {
          newLogs.push({
            id: `bp-low-${Date.now()}`,
            content: `🚨 DANGEROUS: Low blood pressure: ${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)} mmHg`,
            timestamp: new Date(),
            severity: "critical",
          });
        }
      }

      // Check fall
      if (hasFallen) {
        isDangerous = true;
        newLogs.push({
          id: `fall-${Date.now()}`,
          content: `🚨 DANGEROUS: FALL DETECTED - Alerting emergency services`,
          timestamp: new Date(),
          severity: "critical",
        });
      }

      // Check anxiety - dangerous: high level
      if (hasAnxiety && anxietyLevel === "high") {
        isDangerous = true;
        newLogs.push({
          id: `anx-${Date.now()}`,
          content: `🚨 DANGEROUS: HIGH anxiety level detected`,
          timestamp: new Date(),
          severity: "critical",
        });
      }

      if (newLogs.length > 0) {
        setEventLogs((prev) => [...newLogs, ...prev].slice(0, 50)); // Keep last 50 logs
      }

      // Activate chatbot if dangerous condition detected
      if (isDangerous) {
        setShowAIChat(true);
      }
    };

    checkVitals();
  }, [heartRate, breathingRate, bloodPressure, hasFallen, hasAnxiety, anxietyLevel]);

  // Sync event logs to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("eventLogs", JSON.stringify(eventLogs));
  }, [eventLogs]);

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60 || hr > 110) return "critical";
    return "normal";
  };

  const getBreathingRateStatus = (br: number) => {
    if (br < 12 || br > 20) return "critical";
    return "normal";
  };

  const getBloodPressureStatus = (sys: number, dia: number) => {
    const isHighBP = sys > 140 || dia > 90;
    const isLowBP = sys < 90 || dia < 60;
    if (isHighBP || isLowBP) return "critical";
    return "normal";
  };

  const handleEmergencyConfirm = () => {
    setShow911Dialog(false);
    // Add log entry
    const emergencyMessage = isHomeMode
      ? "🚨 EMERGENCY: 911 CALLED - Emergency services have been contacted!"
      : "🚨 EMERGENCY: NURSE CALLED - Nursing staff have been notified!";
    
    setEventLogs((prev) => [
      {
        id: `emergency-${Date.now()}`,
        content: emergencyMessage,
        timestamp: new Date(),
        severity: "critical",
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Enhanced Header */}
        <div className="flex flex-col p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
          {/* Header Row: Left Controls, Center Title, Right Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mode Toggle and Patient Info (stacked vertically) */}
            <div className="flex flex-col gap-2 items-start text-xs">
              {/* ICU/HOME Toggle */}
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${!isHomeMode ? "text-cyan-400" : "text-slate-500"}`}>
                  ICU
                </span>
                <Switch
                  checked={isHomeMode}
                  onCheckedChange={setIsHomeMode}
                  className="h-6 w-11"
                />
                <span className={`font-semibold ${isHomeMode ? "text-green-400" : "text-slate-500"}`}>
                  HOME
                </span>
              </div>
              {/* Patient Name */}
              <div>
                <span className="text-slate-400">Patient Name:</span>
                <span className="text-white font-semibold ml-2">John Doe</span>
              </div>
              {/* ID */}
              <div>
                <span className="text-slate-400">ID:</span>
                <span className="text-cyan-400 font-mono font-bold ml-2">
                  {isHomeMode ? "HOME" : "ICU-04"}
                </span>
              </div>
            </div>

            {/* Center: LifeBeacon Title */}
            <div className="flex items-center justify-center text-center flex-1">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-wider" style={{ fontFamily: 'monospace', letterSpacing: '0.15em', fontWeight: 900 }}>
                  LifeBeacon
                </h1>
                <div className="text-sm text-slate-500 mt-1">Real-time Patient Monitoring</div>
              </div>
            </div>

            {/* Right: Time and Buttons (stacked vertically) */}
            <div className="flex flex-col gap-2 items-end">
              {/* Time */}
              <div className="text-right text-xs">
                <div className="text-slate-400">Time</div>
                <div className="text-sm font-semibold text-white">{new Date().toLocaleTimeString()}</div>
                <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`${isSimulating ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white font-semibold h-8 text-xs`}
                >
                  {isSimulating ? (
                    <>
                      <Pause className="h-3.5 w-3.5 mr-1" />
                      Stop Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 mr-1" />
                      Start Simulation
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className={`${showAIChat ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-700 hover:bg-slate-600"} text-white h-8 text-xs`}
                >
                  <Bot className="h-3.5 w-3.5 mr-1" />
                  AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Feed and Stats Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left: Camera Feed and Event Log */}
          <div className="space-y-3">
            <WebcamFeed />
            
            {/* Collapsible Event Log */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowEventLog(!showEventLog)}
                className="w-full px-3 py-2 flex items-center justify-between bg-slate-900/50 border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  System Events Log
                </h3>
                {showEventLog ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
              
              {showEventLog && (
                <div style={{ height: '300px', overflow: 'hidden' }}>
                  <FullEventLog events={eventLogs} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats and Alerts */}
          <div className="space-y-3">
            {/* Vital Signs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <VitalSignCard
                title="Heart Rate"
                value={Math.round(heartRate)}
                unit="BPM"
                icon={Heart}
                status={getHeartRateStatus(heartRate)}
                subtitle="Normal range: 60-100 BPM"
                chartData={vitalHistory.slice(-10).map((d) => ({ value: d.heartRate }))}
              />
              <VitalSignCard
                title="Breathing Rate"
                value={Math.round(breathingRate)}
                unit="BrPM"
                icon={Waves}
                status={getBreathingRateStatus(breathingRate)}
                subtitle="Normal range: 12-20 BrPM"
                chartData={vitalHistory.slice(-10).map((d) => ({ value: d.breathingRate }))}
              />
              <VitalSignCard
                title="Blood Pressure"
                value={`${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)}`}
                unit="mmHg"
                icon={Gauge}
                status={getBloodPressureStatus(bloodPressure.systolic, bloodPressure.diastolic)}
                subtitle="Normal: <120/<80 mmHg"
                chartData={vitalHistory.slice(-10).map((d) => ({ value: d.systolic }))}
              />
              <Button
                onClick={() => setShow911Dialog(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-auto py-6 rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-red-500/50"
              >
                <Phone className="h-10 w-10" />
                <span className="text-lg">{isHomeMode ? "CALL 911" : "CALL NURSE"}</span>
              </Button>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AlertCard type="fall" isActive={hasFallen} />
              <AlertCard type="anxiety" isActive={hasAnxiety} level={anxietyLevel} />
            </div>
          </div>
        </div>

        {/* Vital Signs Chart */}
        <VitalSignsChart data={vitalHistory} />

        {/* AI Chat Component */}
        {showAIChat && <AIChat />}

      </div>

      {/* 911 Confirmation Dialog */}
      <AlertDialog open={show911Dialog} onOpenChange={setShow911Dialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isHomeMode ? "Emergency Services" : "Call Nurse"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isHomeMode 
                ? "Are you sure you want to call 911? Emergency services will be contacted immediately."
                : "Are you sure you want to call the nurse? A nurse will be contacted immediately."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergencyConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isHomeMode ? "Call 911" : "Call Nurse"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
