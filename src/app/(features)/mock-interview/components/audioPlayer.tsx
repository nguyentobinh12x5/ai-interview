import React from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  volume,
  onVolumeChange,
}) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className={`
      fixed bottom-4 right-4 flex items-center gap-2 
      px-4 py-2 bg-white rounded-full shadow-lg 
      border border-gray-100 transition-opacity duration-300
      ${isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
    >
      <VolumeIcon className="h-5 w-5 text-gray-600" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24 accent-indigo-600"
      />
    </div>
  );
};

export default AudioPlayer;
