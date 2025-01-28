import React from "react";
import { Mic, Send, Loader2 } from "lucide-react";

interface InterviewInputProps {
  inputText: string;
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onInputChange: (text: string) => void;
  onToggleRecording: () => void;
  onSubmit: () => void;
}

const InterviewInput: React.FC<InterviewInputProps> = ({
  inputText,
  isListening,
  isProcessing,
  isSupported,
  onInputChange,
  onToggleRecording,
  onSubmit,
}) => (
  <div className="flex items-end gap-4">
    <button
      onClick={onToggleRecording}
      className={`
        flex-shrink-0 p-3 rounded-xl transition-colors
        ${
          isListening
            ? "bg-red-100 text-red-600 animate-pulse"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }
      `}
      title={isSupported ? "Toggle voice input" : "Voice input not supported"}
    >
      <Mic className="h-5 w-5" />
    </button>
    <div className="flex-1">
      <textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type your response..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        rows={3}
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={isProcessing || !inputText.trim()}
      className="flex-shrink-0 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </button>
  </div>
);

export default InterviewInput;
