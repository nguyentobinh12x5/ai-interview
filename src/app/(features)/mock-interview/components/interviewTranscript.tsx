import React from "react";
import TranscriptMessage from "./transcriptMessage";
import { Message } from "../types/interview";

interface InterviewTranscriptProps {
  messages: (Message & { isPlaying?: boolean })[];
}

const InterviewTranscript: React.FC<InterviewTranscriptProps> = ({
  messages,
}) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-6 h-[470px] overflow-y-auto space-y-6">
      {messages.map((message) => (
        <TranscriptMessage
          key={message.id}
          isUser={message.isUser}
          message={message.text}
          timestamp={message.timestamp}
          isPlaying={message.isPlaying}
        />
      ))}
    </div>
  );
};

export default InterviewTranscript;
