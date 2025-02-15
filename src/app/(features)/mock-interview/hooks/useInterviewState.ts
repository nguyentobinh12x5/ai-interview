import { useState, useCallback } from "react";
import { Message } from "../models/Interview";
import { AudioManager } from "../utils/audioUtils";

export const useInterviewState = (audioManager: AudioManager) => {
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const addMessage = useCallback((text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const playResponse = useCallback(
    async (audioUrl: string) => {
      setIsPlaying(true);
      try {
        await audioManager.playAudio(audioUrl);
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
      setIsPlaying(false);
    },
    [audioManager]
  );

  const resetState = useCallback(() => {
    setIsStarted(false);
    setMessages([]);
    setCurrentResponse(0);
    setIsPlaying(false);
    audioManager.stop();
  }, [audioManager]);

  return {
    isStarted,
    setIsStarted,
    messages,
    currentResponse,
    setCurrentResponse,
    isPlaying,
    volume,
    setVolume,
    addMessage,
    playResponse,
    resetState,
  };
};
