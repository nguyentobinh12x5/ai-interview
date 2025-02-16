import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Loader2, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface InterviewInputProps {
  isProcessing: boolean;
  onSubmit: (transcription: string) => Promise<void>;
  error: string | null;
}

const WaveformAnimation = () => (
  <div className="flex items-center justify-center gap-1 h-8 mb-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-indigo-600 rounded-full"
        animate={{
          height: [12, 32, 12],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

const InterviewInput: React.FC<InterviewInputProps> = ({
  isProcessing,
  onSubmit,
  error,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    error: recordingError, 
    transcription 
  } = useAudioRecorder();

  useEffect(() => {
    if (transcription && !isRecording) {
      handleSubmission(transcription);
    }
  }, [transcription, isRecording]);

  const handleSubmission = async (text: string) => {
    if (!text || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(text);
    } catch (err) {
      console.error("Error submitting transcription:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async () => {
    if (isRecording) {
      try {
        await stopRecording();
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
    } else {
      try {
        await startRecording();
      } catch (err) {
        console.error("Error starting recording:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {(error || recordingError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-red-500 text-sm mb-2"
          >
            {error || recordingError}
          </motion.div>
        )}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full"
          >
            <WaveformAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleAction}
        disabled={isProcessing || isSubmitting}
        className={`
          p-4 rounded-full transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
        `}
        whileTap={{ scale: 0.95 }}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isProcessing || isSubmitting ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default InterviewInput;
