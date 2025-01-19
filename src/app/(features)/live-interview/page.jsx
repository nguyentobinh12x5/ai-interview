"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
let apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
let socket;
let recorder;

const Page = () => {
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
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
          "wss://api.deepgram.com/v1/listen?model=nova-2&language=vi",
          ["token", apiKey]
        );

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
            setTranscript((prev) => {
              const lastEntry = prev[prev.length - 1];
              const currentTime = formatTime(time);
              if (lastEntry && lastEntry.time === currentTime) {
                lastEntry.text += " " + transcript;
                return [...prev.slice(0, -1), lastEntry];
              } else {
                return [...prev, { time: currentTime, text: transcript }];
              }
            });
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
    setSelectedText(selectedText);
  };
  const processString = (data) => {
    data = data.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    data = data.replace(/^\* (.*)$/gm, "<li>$1</li>");
    data = data.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
    data = data.replace(/<\/ul><ul>/g, "");
    data = data.replace(/<li>(.*?)<\/li><br>/g, "<li>$1</li>");
    return "<p>" + data + "</p>";
  };

  const askAi = async () => {
    try {
      const response = await axios.post("/api/live-interview", selectedText, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const text = processString(response.data.text);
      setAiResponse(text);
    } catch (err) {
      setError("Error when connecting with server");
    }
    setSelectedText("");
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 mx-auto h-full">
      <div className="bg-gray-100 p-4 flex flex-col space-y-4">
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
                  className="rounded-full"
                >
                  Start
                </Button>
              ) : (
                <Button
                  id="stop"
                  onClick={stopTranscription}
                  variant={"outline"}
                  className="rounded-full"
                >
                  Stop
                </Button>
              )}
              <Button
                id="clear"
                onClick={clearTranscription}
                className="rounded-full"
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-4 h-[300px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full border border-gray-500 bg-black"
            ></video>
          </div>
        </div>
        <div className="bg-white p-4 flex-1 overflow-y-scroll">
          <h2 className="text-base font-bold">Transcript</h2>
          <div id="transcript" onMouseUp={handleTextSelection}>
            {/* {transcript.map((entry, index) => (
              <div key={index}>
                <span className="font-bold">{entry.time}</span>: {entry.text}
              </div>
            ))} */}
            <div>What is SQL?</div>
          </div>
          {selectedText && (
            <Button onClick={askAi} className="rounded-full mt-2">
              Ask AI
            </Button>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-4">
        <h2 className="text-base font-bold">Interview with AI</h2>
        <Button className="rounded-full bg-green-200 text-green-600 mt-2">
          Ready
        </Button>
        <div className="mt-4">
          AI is currently listening to your interview. Please wait for the
          answer.
        </div>
        {aiResponse && (
          <div className="mt-4 bg-white p-4">
            <h3 className="text-base font-bold">AI Response:</h3>
            <div
              id="sqlContent"
              dangerouslySetInnerHTML={{ __html: aiResponse }}
            />
          </div>
        )}
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
