"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { Markdown } from "@/components/ui/markdown";
let socket;
let recorder;

const Page = () => {
  const { messages, append } = useChat({
    api: "/api/live-interview",
    maxSteps: 2,
  });
  const [transcript, setTranscript] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [time, setTime] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isSharing) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSharing]);

  const startTranscription = async () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then(async (screenStream) => {
        if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY)
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

        socket = new WebSocket(process.env.NEXT_PUBLIC_DEEPGRAM_URL, [
          "token",
          process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
        ]);

        recorder.addEventListener("dataavailable", (evt) => {
          if (evt.data.size > 0 && socket.readyState == 1)
            socket.send(evt.data);
        });

        socket.onopen = () => {
          recorder.start(500);
        };

        socket.onmessage = (msg) => {
          const { transcript } = JSON.parse(msg.data).channel.alternatives[0];
          if (transcript) {
            setTranscript((prevTranscript) => [...prevTranscript, transcript]);
          }
        };

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          videoRef.current.play();
        }
        setIsSharing(true);
        setTime(0);
      });
  };

  const stopTranscription = () => {
    if (recorder) {
      recorder.stop();
    }
    if (socket) {
      socket.close();
    }
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsSharing(false);
    alert("Transcription ended");
  };

  const clearTranscription = () => {
    setTranscript([]);
  };

  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    setSelectedText(selectedText);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const askAi = () => {
    if (selectedText) {
      append({ role: "user", content: selectedText });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 h-full">
      <div className="flex flex-col space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Live Interview</h1>
            <div className="space-x-2 flex items-center">
              {isSharing && (
                <div className="ml-4 text-lg font-bold">{formatTime(time)}</div>
              )}
              {!isSharing ? (
                <Button
                  id="start"
                  onClick={startTranscription}
                  variant={"default"}
                >
                  Start
                </Button>
              ) : (
                <Button
                  id="stop"
                  onClick={stopTranscription}
                  variant={"default"}
                >
                  Stop
                </Button>
              )}
              <Button
                id="clear"
                onClick={clearTranscription}
                variant={"destructive"}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full border border-gray-500 bg-black"
            ></video>
          </div>
        </div>
        <div className="bg-white flex-1 overflow-auto">
          <h2 className="text-base font-medium">
            Transcript from your interview
          </h2>
          {transcript ?? (
            <div id="transcript" onMouseUp={handleTextSelection}>
              <div className="bg-gray-200 p-2 rounded-md">
                <div>{transcript}</div>
              </div>
            </div>
          )}
          {selectedText && (
            <Button onClick={askAi} className="rounded-full mt-2">
              Ask AI
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <h2 className="text-base font-bold">Interview with AI</h2>
        <div className="mt-4">
          AI is currently listening to your interview. Please wait for the
          answer.
        </div>
        {messages.map((message) => (
          <div key={message.id}>
            <div className="font-bold uppercase">{message.role}</div>
            <Markdown>{message.content}</Markdown>
          </div>
        ))}
      </div>
    </div>
  );
};

function mix(audioContext, streams) {
  const dest = audioContext.createMediaStreamDestination();
  streams.forEach((stream) => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(dest);
  });
  return dest.stream;
}
export default Page;
