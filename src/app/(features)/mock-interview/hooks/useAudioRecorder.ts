import { useState, useCallback, useRef } from 'react';

interface AudioRecorderHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
  transcription: string | null;
}

export const useAudioRecorder = (): AudioRecorderHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const audioStream = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Initialize stream with optimized audio constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1, // Mono for better compatibility
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      audioStream.current = stream;

      // Pre-warm the audio context
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);

      // Add small delay to ensure stable initialization
      await new Promise(resolve => setTimeout(resolve, 200));

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000, // Optimal bitrate for voice
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { 
          type: 'audio/webm;codecs=opus'
        });
        chunks.current = [];
        
        // Clean up audio context
        audioContext.close();
        
        try {
          // Create FormData and append the audio blob
          const formData = new FormData();
          formData.append('file', blob, 'recording.webm');

          // Call the STT API
          const response = await fetch('https://service-api.beatinterview.com/api/Stt', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to transcribe audio');
          }

          const transcriptionResult = await response.text();
          console.log('Transcription result:', transcriptionResult);
          setTranscription(transcriptionResult);
          setError(null);
        } catch (err) {
          console.error('Transcription error:', err);
          setError('Failed to transcribe audio');
        }

        // Clean up audio stream
        if (audioStream.current) {
          audioStream.current.getTracks().forEach(track => track.stop());
          audioStream.current = null;
        }
      };

      mediaRecorder.current.start(10); // Smaller timeslice for better buffering
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording. Please check your microphone permissions.');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
    transcription
  };
}; 