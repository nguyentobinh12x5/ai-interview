"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const videoRef = useRef(null); // Ref cho video element
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true; // Continuous transcription
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Capture audio
      });
      setMediaStream(stream);

      // Gắn stream vào video element để hiển thị
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      handleAudioStream(stream);
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }
  };

  const handleAudioStream = (stream) => {
    // Direct the audio stream to recognition
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);

    const tracks = destination.stream.getAudioTracks();
    if (tracks.length > 0) {
      // If audio track exists, start recognition
      startTranscription();
    } else {
      console.warn("No audio track detected in the shared screen.");
    }
  };

  const startTranscription = () => {
    setIsRecording(true);
    recognitionRef.current.lang = "vi-VN"; // Vietnamese transcription
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current.stop();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  return (
    <div>
      <h1>Speech to Text with Screen Sharing</h1>

      <Button onClick={startScreenSharing} disabled={isRecording}>
        Share Screen & Start Recording
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </Button>

      {/* Video để hiển thị màn hình đang share */}
      <div style={{ marginTop: "20px" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", border: "1px solid #ccc" }}
          autoPlay
          muted // Muted để không gây xung đột với audio
        ></video>
      </div>

      <p style={{ marginTop: "20px" }}>Transcript: {transcript}</p>
    </div>
  );
}
