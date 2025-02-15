import React from "react";
import { Volume2 } from "lucide-react";

interface MessageAudioProgressProps {
  isPlaying: boolean;
}

const MessageAudioProgress: React.FC<MessageAudioProgressProps> = ({
  isPlaying,
}) => {
  if (!isPlaying) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <Volume2 className="h-4 w-4 text-indigo-600" />
      <div className="relative w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 animate-[progress_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
};

export default MessageAudioProgress;
