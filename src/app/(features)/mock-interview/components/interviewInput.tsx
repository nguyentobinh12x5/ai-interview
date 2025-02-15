import React from "react";
import { Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InterviewInputProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onToggleRecording: () => void;
  onSubmit: () => void;
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
  isListening,
  isProcessing,
  isSupported,
  onToggleRecording,
  onSubmit,
  error,
}) => {
  const handleAction = () => {
    if (isListening) {
      onSubmit();
    } else {
      onToggleRecording();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-red-500 text-sm mb-2"
          >
            {error}
          </motion.div>
        )}
        {isListening && (
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
        disabled={isProcessing}
        className={`
          p-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'bg-red-100 hover:bg-red-200' : ''}
          ${isListening 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-110' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }
          ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}
        `}
        whileTap={{ scale: 0.95 }}
        title={
          isSupported 
            ? isListening 
              ? "Send response" 
              : "Start recording" 
            : "Voice input not supported"
        }
        aria-label={
          isProcessing 
            ? "Processing" 
            : isListening 
              ? "Send response" 
              : "Start recording"
        }
      >
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isListening ? (
          <Send className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default InterviewInput;
