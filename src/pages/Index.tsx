import { useState, useEffect } from "react";
import { Heart, Waves, Gauge } from "lucide-react";
import { VitalSignCard } from "@/components/VitalSignCard";
import { WebcamFeed } from "@/components/WebcamFeed";
import { VitalSignsChart } from "@/components/VitalSignsChart";

interface VitalDataPoint {
  timestamp: number;
  time: string;
  heartRate: number;
  breathingRate: number;
  systolic: number;
  diastolic: number;
}

const Index = () => {
  const [heartRate, setHeartRate] = useState(72);
  const [breathingRate, setBreathingRate] = useState(16);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [vitalHistory, setVitalHistory] = useState<VitalDataPoint[]>([]);

  /* ------------------ SIMULATED REAL-TIME DATA ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => Math.max(55, Math.min(150, prev + (Math.random() - 0.5) * 10)));
      setBreathingRate((prev) => Math.max(10, Math.min(30, prev + (Math.random() - 0.5) * 4)));
      setBloodPressure((prev) => ({
        systolic: Math.max(90, Math.min(180, prev.systolic + (Math.random() - 0.5) * 10)),
        diastolic: Math.max(60, Math.min(120, prev.diastolic + (Math.random() - 0.5) * 6)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------ RECORD VITAL HISTORY ------------------ */
  useEffect(() => {
    const newPoint: VitalDataPoint = {
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      heartRate: Math.round(heartRate),
      breathingRate: Math.round(breathingRate),
      systolic: Math.round(bloodPressure.systolic),
      diastolic: Math.round(bloodPressure.diastolic),
    };

    setVitalHistory((prev) => [...prev, newPoint].slice(-120));
  }, [heartRate, breathingRate, bloodPressure]);

  /* ------------------ VITAL STATUS LOGIC ------------------ */
  const getStatusColor = () => {
    let issues = 0;

    if (heartRate < 60 || heartRate > 110) issues++;
    if (breathingRate < 12 || breathingRate > 20) issues++;
    const sys = bloodPressure.systolic;
    const dia = bloodPressure.diastolic;
    if (sys > 140 || sys < 90 || dia > 90 || dia < 60) issues++;

    if (issues === 0) return { text: "Vitals Normal", color: "bg-green-600" };
    if (issues === 1) return { text: "Vitals Slightly Abnormal", color: "bg-yellow-600" };
    return { text: "Vitals Critical", color: "bg-red-700" };
  };

  const vitalsStatus = getStatusColor();

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ------------------ CAMERA + STATUS BOX ------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Camera Feed */}
          <div className="space-y-3">
            <WebcamFeed />
          </div>

          {/* Status Box */}
          <div
            className={`rounded-xl h-full flex items-center justify-center text-white text-3xl font-bold border border-slate-800 ${vitalsStatus.color}`}
          >
            {vitalsStatus.text}
          </div>
        </div>

        {/* ------------------ VITAL CARDS ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VitalSignCard
            title="Heart Rate"
            value={Math.round(heartRate)}
            unit="BPM"
            icon={Heart}
            status={heartRate < 60 || heartRate > 110 ? "critical" : "normal"}
            subtitle="Normal: 60-100"
            chartData={vitalHistory.slice(-10).map((d) => ({ value: d.heartRate }))}
          />

          <VitalSignCard
            title="Breathing Rate"
            value={Math.round(breathingRate)}
            unit="BrPM"
            icon={Waves}
            status={breathingRate < 12 || breathingRate > 20 ? "critical" : "normal"}
            subtitle="Normal: 12-20"
            chartData={vitalHistory.slice(-10).map((d) => ({ value: d.breathingRate }))}
          />

          <VitalSignCard
            title="Blood Pressure"
            value={`${Math.round(bloodPressure.systolic)}/${Math.round(bloodPressure.diastolic)}`}
            unit="mmHg"
            icon={Gauge}
            status={
              bloodPressure.systolic > 140 ||
              bloodPressure.systolic < 90 ||
              bloodPressure.diastolic > 90 ||
              bloodPressure.diastolic < 60
                ? "critical"
                : "normal"
            }
            subtitle="Normal: <120/<80"
            chartData={vitalHistory.slice(-10).map((d) => ({ value: d.systolic }))}
          />
        </div>

        {/* ------------------ GRAPH SECTION ------------------ */}
        <VitalSignsChart data={vitalHistory} />

      </div>
    </div>
  );
};

export default Index;
