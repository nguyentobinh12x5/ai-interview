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
          "wss://api.deepgram.com/v1/listen?model=nova-2&language=vi",
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4 mx-auto p-4 h-full">
      <div className="bg-gray-100 p-4 flex flex-col space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Live Interview</h1>
            <div className="space-x-2">
              <Button
                id="start"
                onClick={startTranscription}
                className="rounded-full"
              >
                Select
              </Button>
              <Button
                id="stop"
                onClick={stopTranscription}
                variant={"outline"}
                className="rounded-full"
              >
                Live
              </Button>
              <Button
                id="clear"
                onClick={clearTranscription}
                className="rounded-full"
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
        <div className="bg-white p-4 flex-1">
          <h2 className="text-base font-bold">
            Transcript from your interviewer
          </h2>
          <p id="transcript">{transcript}</p>
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
      </div>
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
