"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import InterviewHeader from "./components/interviewHeader";
import InterviewTranscript from "./components/interviewTranscript";
import InterviewInput from "./components/interviewInput";
import AudioPlayer from "./components/audioPlayer";
import LanguageSelectionModal from "./components/languageSelectionModal";
import SpeechSynthesisManager from "./utils/speechSynthesis";
import { AudioManager } from "./utils/audioUtils";
import mockData from "./data/MockInterviewFaker.json";
import { useInterviewState } from "./hooks/useInterviewState";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";

const page = () => {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const audioManager = useRef(new AudioManager());
  const speechSynthesis = useRef(SpeechSynthesisManager.getInstance());

  const {
    isStarted,
    setIsStarted,
    messages,
    currentResponse,
    setCurrentResponse,
    isPlaying,
    volume,
    setVolume,
    addMessage,
    resetState,
  } = useInterviewState(audioManager.current);

  useEffect(() => {
    const handleSpeechStart = () => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isUser) {
        setPlayingMessageId(lastMessage.id);
      }
    };

    const handleSpeechEnd = () => {
      setPlayingMessageId(null);
    };

    speechSynthesis.current.on("speechStart", handleSpeechStart);
    speechSynthesis.current.on("speechEnd", handleSpeechEnd);

    return () => {
      speechSynthesis.current.removeListener("speechStart", handleSpeechStart);
      speechSynthesis.current.removeListener("speechEnd", handleSpeechEnd);
    };
  }, [messages]);

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    setInputText(text);
  }, []);

  const { isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition(handleTranscript, selectedLanguage);

  const handleInputChange = useCallback(
    (text: string) => {
      if (isListening && text !== inputText) {
        stopListening();
      }
      setInputText(text);
    },
    [isListening, stopListening, inputText]
  );

  const handleToggleRecording = useCallback(() => {
    if (!isSupported) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, isSupported, startListening, stopListening]);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim() || isProcessing) return;

    if (isListening) {
      stopListening();
    }

    setIsProcessing(true);
    addMessage(inputText, true);
    setInputText("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const nextResponse = mockData.interviewer.responses[currentResponse + 1];
    if (nextResponse) {
      addMessage(nextResponse.text, false);
      setCurrentResponse((prev) => prev + 1);
      await speechSynthesis.current.speak(nextResponse.text);
    }

    setIsProcessing(false);
  }, [
    inputText,
    isProcessing,
    currentResponse,
    isListening,
    stopListening,
    addMessage,
    setCurrentResponse,
  ]);

  const handleLanguageSelect = useCallback(
    (language: string, voice: SpeechSynthesisVoice) => {
      setSelectedLanguage(language);
      setSelectedVoice(voice);
      speechSynthesis.current.setVoice(voice);
      handleStart();
    },
    []
  );

  const handleStart = useCallback(async () => {
    setIsStarted(true);
    const firstResponse = mockData.interviewer.responses[0];
    addMessage(firstResponse.text, false);
    await speechSynthesis.current.speak(firstResponse.text);
  }, [setIsStarted, addMessage]);

  const handleEnd = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    speechSynthesis.current.stop();
    resetState();
    setInputText("");
    setIsProcessing(false);
    setPlayingMessageId(null);
  }, [resetState, isListening, stopListening]);
  return (
    <div>
      <InterviewHeader
        isStarted={isStarted}
        onStart={() => setShowLanguageModal(true)}
        onEnd={handleEnd}
        onLanguageSelect={() => setShowLanguageModal(true)}
      />

      {isStarted && (
        <>
          <div className="relative h-48 mb-8 rounded-2xl overflow-hidden">
            <img
              src={mockData.interviewer.image}
              alt="Interviewer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <InterviewTranscript
            messages={messages.map((msg) => ({
              ...msg,
              isPlaying: msg.id === playingMessageId,
            }))}
          />

          <InterviewInput
            inputText={inputText}
            isListening={isListening}
            isProcessing={isProcessing}
            isSupported={isSupported}
            onInputChange={handleInputChange}
            onToggleRecording={handleToggleRecording}
            onSubmit={handleSubmit}
          />
        </>
      )}

      <AudioPlayer
        isPlaying={isPlaying}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={handleLanguageSelect}
      />
    </div>
  );
};

export default page;
