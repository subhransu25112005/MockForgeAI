import { useEffect, useRef, useState } from "react";

export default function ConfidenceCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [confidence, setConfidence] = useState(60);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => console.log("Camera blocked"));
  }, []);

  // Simulated live confidence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(prev => {
        let change = Math.random() * 6 - 3;
        let next = Math.min(95, Math.max(40, prev + change));
        return Math.round(next);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-2xl border border-cyan-500/20">
      <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg" />

      <p className="text-sm mt-2 text-white">
        Confidence: {confidence}%
      </p>

      <div className="w-full h-2 bg-gray-700 rounded mt-1">
        <div
          className="h-2 bg-cyan-400 rounded transition-all"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
