import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const WebcamFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    const updateCanvas = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    // Draw frames continuously
    const drawFrame = () => {
      if (isActive && ctx) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Mirror the video
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0);
          ctx.restore();
        }
        requestAnimationFrame(drawFrame);
      }
    };

    video.addEventListener("loadedmetadata", updateCanvas);
    drawFrame();

    return () => {
      video.removeEventListener("loadedmetadata", updateCanvas);
    };
  }, [isActive]);

  const startWebcam = async () => {
    try {
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      console.log("Camera access granted, stream:", mediaStream);
      
      // Attach stream to video element immediately
      if (videoRef.current) {
        console.log("Attaching stream to video element");
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => console.error("Play error:", err));
      }
      
      // Set stream state after attaching
      setStream(mediaStream);
      setIsActive(true);
      
      console.log("Camera started successfully");
      
      toast({
        title: "Camera activated",
        description: "Webcam feed is now live",
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);
      toast({
        title: "Camera deactivated",
        description: "Webcam feed stopped",
      });
    }
  };

  useEffect(() => {
    // Cleanup function - stop stream when component unmounts or stops
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-800">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Camera Feed
        </CardTitle>
        <Button
          variant={isActive ? "destructive" : "default"}
          size="sm"
          onClick={isActive ? stopWebcam : startWebcam}
          className="h-8 text-xs"
        >
          {isActive ? (
            <>
              <VideoOff className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
          {/* Hidden video element for stream capture */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }}
          />
          
          {/* Canvas for display */}
          {isActive ? (
            <>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-red-600/90 px-1.5 py-0.5 rounded text-xs font-bold text-white">
                  <div className="w-1.5 h-1.5 bg-red-200 rounded-full animate-pulse" />
                  LIVE REC
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-gray-300 bg-black/50 px-1.5 py-0.5 rounded">
                CAM-01: ICU BED 4
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <VideoOff className="h-16 w-16 text-slate-600" />
              <p className="text-sm text-slate-400 font-medium">
                Click "Start" to begin camera feed
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
