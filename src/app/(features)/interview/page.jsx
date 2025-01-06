"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
let apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
let socket;
let recorder;

const Page = () => {
  const [transcript, setTranscript] = useState("");
  const videoRef = useRef(null);

  const startTranscription = async () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(async (screenStream) => {
        if (!apiKey)
          return alert(
            "You must provide a Deepgram API Key in the options page."
          );
        if (screenStream.getAudioTracks().length == 0)
          return alert("You must share your tab with audio. Refresh the page.");

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioContext = new AudioContext();
        const mixed = mix(audioContext, [screenStream, micStream]);
        recorder = new MediaRecorder(mixed, { mimeType: "audio/webm" });

        socket = new WebSocket(
          "wss://api.deepgram.com/v1/listen?model=general-enhanced",
          ["token", apiKey]
        );

        recorder.addEventListener("dataavailable", (evt) => {
          if (evt.data.size > 0 && socket.readyState == 1)
            socket.send(evt.data);
        });

        socket.onopen = () => {
          recorder.start(250);
        };

        socket.onmessage = (msg) => {
          const { transcript } = JSON.parse(msg.data).channel.alternatives[0];
          if (transcript) {
            setTranscript((prev) => prev + " " + transcript);
          }
        };

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          videoRef.current.play();
        }
      });
  };

  const stopTranscription = () => {
    if (recorder) {
      recorder.stop();
    }
    if (socket) {
      socket.close();
    }
    alert("Transcription ended");
  };

  const clearTranscription = () => {
    setTranscript("");
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex space-x-4">
        <Button id="start" onClick={startTranscription}>
          Start transcription
        </Button>
        <Button id="stop" onClick={stopTranscription}>
          Stop transcription
        </Button>
        <Button id="clear" onClick={clearTranscription}>
          Clear transcription
        </Button>
      </div>
      <div className="mt-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-[50%] border border-gray-500"
        ></video>
      </div>
      <p id="transcript">{transcript}</p>
    </div>
  );
};

// https://stackoverflow.com/a/47071576
function mix(audioContext, streams) {
  const dest = audioContext.createMediaStreamDestination();
  streams.forEach((stream) => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(dest);
  });
  return dest.stream;
}

export default Page;
