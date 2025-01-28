import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionHook {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export const useSpeechRecognition = (
  onTranscript: (text: string, isFinal: boolean) => void,
  language: string
): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const resultBufferRef = useRef<string>("");

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Handle interim results
      if (interimTranscript) {
        const combinedText = resultBufferRef.current + " " + interimTranscript;
        onTranscript(combinedText.trim(), false);
      }

      // Handle final results
      if (finalTranscript) {
        resultBufferRef.current += " " + finalTranscript;
        resultBufferRef.current = resultBufferRef.current.trim();
        onTranscript(resultBufferRef.current, true);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      resultBufferRef.current = "";
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    isSupported: !!recognitionRef.current,
    startListening,
    stopListening,
  };
};
