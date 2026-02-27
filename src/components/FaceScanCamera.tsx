import { useEffect, useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaceScanCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const FaceScanCamera = ({ isOpen, onClose, onCapture }: FaceScanCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [instruction, setInstruction] = useState("Posisjonér ansiktet i ovalen");
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startFaceDetection();
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setInstruction("Kunne ikke få tilgang til kamera");
    }
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startFaceDetection = () => {
    // Simulate face detection with simple mock logic
    // In production, you could use @huggingface/transformers for real face detection
    const detectFace = () => {
      if (!videoRef.current || !isOpen) return;

      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Simple heuristic: check if video is active and has reasonable dimensions
      if (videoWidth > 0 && videoHeight > 0) {
        // Simulate face being detected in center region
        const centerX = videoWidth / 2;
        const centerY = videoHeight / 2;
        const faceRegionSize = Math.min(videoWidth, videoHeight) * 0.6;

        // Simulate that face is detected if camera is active
        if (!isScanning && videoWidth > 0) {
          setIsScanning(true);
          setInstruction("Hold stille...");
          startScanAnimation();
        }
      }

      animationRef.current = requestAnimationFrame(detectFace);
    };

    detectFace();
  };

  const startScanAnimation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setInstruction("Perfekt! Tar bilde...");
        setTimeout(() => {
          captureImage();
        }, 500);
      }
    }, 30);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    onCapture(imageDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Preview */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay with face guide */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Top instruction */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
            {instruction}
          </p>
        </div>

        {/* Face guide oval */}
        <div className="relative">
          <svg
            width="300"
            height="400"
            viewBox="0 0 300 400"
            className="drop-shadow-2xl"
          >
            {/* Background dimming */}
            <defs>
              <mask id="face-mask">
                <rect width="300" height="400" fill="white" />
                <ellipse cx="150" cy="200" rx="130" ry="170" fill="black" />
              </mask>
            </defs>
            
            {/* Dimmed background */}
            <rect
              width="300"
              height="400"
              fill="black"
              opacity="0.6"
              mask="url(#face-mask)"
            />

            {/* Face guide outline */}
            <ellipse
              cx="150"
              cy="200"
              rx="130"
              ry="170"
              fill="none"
              stroke={isScanning ? "#10b981" : "#ffffff"}
              strokeWidth="3"
              strokeDasharray={isScanning ? "0" : "10 5"}
              className="transition-all duration-300"
            />

            {/* Scanning line animation */}
            {isScanning && (
              <line
                x1="20"
                y1={30 + (scanProgress / 100) * 340}
                x2="280"
                y2={30 + (scanProgress / 100) * 340}
                stroke="#10b981"
                strokeWidth="2"
                opacity="0.8"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
            )}

            {/* Corner guides */}
            {!isScanning && (
              <>
                {/* Top corners */}
                <path d="M 20 30 L 20 60" stroke="white" strokeWidth="3" />
                <path d="M 20 30 L 50 30" stroke="white" strokeWidth="3" />
                <path d="M 280 30 L 280 60" stroke="white" strokeWidth="3" />
                <path d="M 280 30 L 250 30" stroke="white" strokeWidth="3" />
                
                {/* Bottom corners */}
                <path d="M 20 370 L 20 340" stroke="white" strokeWidth="3" />
                <path d="M 20 370 L 50 370" stroke="white" strokeWidth="3" />
                <path d="M 280 370 L 280 340" stroke="white" strokeWidth="3" />
                <path d="M 280 370 L 250 370" stroke="white" strokeWidth="3" />
              </>
            )}
          </svg>

          {/* Scanning progress indicator */}
          {isScanning && (
            <div className="absolute -bottom-12 left-0 right-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden mx-8">
                <div
                  className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom tips */}
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4 mx-8 space-y-2">
            <p className="text-white text-sm">Tips for best resultat:</p>
            <ul className="text-white/80 text-xs space-y-1">
              <li>✓ God belysning</li>
              <li>✓ Se rett inn i kameraet</li>
              <li>✓ Hold telefonen i håndhøyde</li>
            </ul>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Manual capture button (backup) */}
        {!isScanning && (
          <Button
            onClick={captureImage}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full w-16 h-16 bg-white hover:bg-white/90"
            size="icon"
          >
            <Camera className="w-8 h-8 text-black" />
          </Button>
        )}
      </div>
    </div>
  );
};
