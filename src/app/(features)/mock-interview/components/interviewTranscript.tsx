import React, { useEffect, useRef } from "react";
import TranscriptMessage from "./transcriptMessage";
import { Message } from "../types/interview";

interface InterviewTranscriptProps {
  messages: (Message & { isPlaying?: boolean })[];
}

const InterviewTranscript: React.FC<InterviewTranscriptProps> = ({
  messages,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-6 h-[470px] overflow-y-auto space-y-6">
      {messages.map((message) => (
        <TranscriptMessage
          key={`${message.id}-${message.timestamp}`}
          isUser={message.isUser}
          message={message.text}
          timestamp={message.timestamp}
          isPlaying={message.isPlaying}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default InterviewTranscript;
