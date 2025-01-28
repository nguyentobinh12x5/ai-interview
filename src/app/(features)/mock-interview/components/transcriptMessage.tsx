import React from "react";
import { User, UserCircle2 } from "lucide-react";
import MessageAudioProgress from "./messageAudioProgress";

interface TranscriptMessageProps {
  isUser: boolean;
  message: string;
  timestamp: string;
  isPlaying?: boolean;
}

const TranscriptMessage: React.FC<TranscriptMessageProps> = ({
  isUser,
  message,
  timestamp,
  isPlaying = false,
}) => (
  <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
    <div
      className={`
      flex-shrink-0 h-10 w-10 rounded-full 
      ${isUser ? "bg-indigo-100" : "bg-gray-100"} 
      flex items-center justify-center
    `}
    >
      {isUser ? (
        <User className="h-5 w-5 text-indigo-600" />
      ) : (
        <UserCircle2 className="h-5 w-5 text-gray-600" />
      )}
    </div>
    <div
      className={`
      flex-1 max-w-[80%] rounded-2xl px-4 py-2
      ${isUser ? "bg-indigo-50" : "bg-white border border-gray-100"}
    `}
    >
      <p className={`text-sm ${isUser ? "text-indigo-900" : "text-gray-900"}`}>
        {message}
      </p>
      <span className="text-xs text-gray-400 mt-1 block">{timestamp}</span>
      {!isUser && <MessageAudioProgress isPlaying={isPlaying} />}
    </div>
  </div>
);

export default TranscriptMessage;
