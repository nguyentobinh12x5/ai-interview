import React, { forwardRef, useEffect } from "react";
import { motion } from "framer-motion";

interface WebcamStreamProps {
  isActive: boolean;
  onStreamReady?: (stream: MediaStream) => void;
}

const WebcamStream = forwardRef<HTMLVideoElement, WebcamStreamProps>(
  ({ isActive, onStreamReady }, ref) => {
    useEffect(() => {
      if (isActive && ref && 'current' in ref && ref.current) {
        const videoElement = ref.current;
        
        const startStream = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
              },
              audio: false
            });
            
            videoElement.srcObject = stream;
            await videoElement.play();
            
            if (onStreamReady) {
              onStreamReady(stream);
            }
          } catch (err) {
            console.error("Error accessing webcam:", err);
          }
        };

        startStream();

        return () => {
          const stream = videoElement.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          videoElement.srcObject = null;
        };
      }
    }, [isActive, ref, onStreamReady]);

    if (!isActive) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative mt-4 rounded-2xl overflow-hidden bg-black w-full h-[180px] mx-auto shadow-lg"
      >
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </motion.div>
    );
  }
);

WebcamStream.displayName = "WebcamStream";

export default WebcamStream; 