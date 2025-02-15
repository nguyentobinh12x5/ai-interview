import React from "react";
import { User, UserCircle2 } from "lucide-react";
import MessageAudioProgress from "./messageAudioProgress";
import { cn } from "@/lib/utils";

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
  <div className="flex w-full">
    <div
      className={cn(
        "flex gap-4 max-w-[80%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
          isUser ? "bg-indigo-100" : "bg-gray-100"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-indigo-600" />
        ) : (
          <UserCircle2 className="h-5 w-5 text-gray-600" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 rounded-2xl px-4 py-2",
          isUser
            ? "bg-indigo-600 text-white rounded-tr-none"
            : "bg-white border border-gray-100 rounded-tl-none"
        )}
      >
        <p className="text-sm break-words">{message}</p>
        <span
          className={cn(
            "text-xs mt-1 block",
            isUser ? "text-indigo-50" : "text-gray-400"
          )}
        >
          {timestamp}
        </span>
        {!isUser && <MessageAudioProgress isPlaying={isPlaying} />}
      </div>
    </div>
  </div>
);

export default TranscriptMessage;
