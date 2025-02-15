"use client";

import { useEffect, useRef, useState } from "react";

interface InterviewTimerProps {
  isStarted: boolean;
  onReset?: () => void;
}

const InterviewTimer = ({ isStarted, onReset }: InterviewTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const startTimer = () => {
      if (!intervalRef.current) {
        startTimeRef.current = Date.now() - elapsedTime * 1000;
        
        intervalRef.current = setInterval(() => {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setElapsedTime(currentElapsed);
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };

    if (isStarted) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [isStarted, elapsedTime]);

  useEffect(() => {
    if (!isStarted) {
      setElapsedTime(0);
      if (onReset) onReset();
    }
  }, [isStarted, onReset]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="flex items-center space-x-4"
      role="timer"
      aria-label={`Elapsed time: ${formatTime(elapsedTime)}`}
    >
      <span className="text-lg font-medium">{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default InterviewTimer; 