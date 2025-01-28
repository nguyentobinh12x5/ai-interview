import React from "react";
import { Play, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewHeaderProps {
  isStarted: boolean;
  onStart: () => void;
  onEnd: () => void;
  onLanguageSelect: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  isStarted,
  onStart,
  onEnd,
  onLanguageSelect,
}) => (
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
    <div className="space-x-4">
      {!isStarted ? (
        <Button
          onClick={onLanguageSelect}
          className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Interview
        </Button>
      ) : (
        <Button
          onClick={onEnd}
          className="bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <StopCircle className="h-5 w-5 mr-2" />
          End Interview
        </Button>
      )}
    </div>
  </div>
);

export default InterviewHeader;
