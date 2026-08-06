import { useState, useEffect, useRef, useCallback } from "react";
import { useConsultationStore } from "../stores/consultationStore";
import { authService } from "../services/authService";
import { Transcript } from "../types";

export function useAudioStream(consultationUuid: string) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { addTranscriptChunk, transcripts } = useConsultationStore();

  const stopRecording = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error("Error stopping MediaRecorder:", err);
      }
    }
    mediaRecorderRef.current = null;

    // Stop microphone tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsRecording(false);
    setIsConnected(false);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;

      // 2. Fetch secure temporary token for WebSocket connection
      const token = await authService.getWsToken();

      // 3. Establish WebSocket connection
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/audio/stream/${consultationUuid}?token=${token}`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        // 4. Initialize MediaRecorder once socket is open
        const options = { mimeType: "audio/webm;codecs=opus" };
        let mediaRecorder: MediaRecorder;
        
        try {
          mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
          console.warn("audio/webm;codecs=opus not supported, falling back to default MIME type");
          mediaRecorder = new MediaRecorder(stream);
        }
        
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Read blob as ArrayBuffer and send as binary bytes
            const arrayBuffer = await event.data.arrayBuffer();
            ws.send(arrayBuffer);
          }
        };

        // Send raw audio data every 250ms
        mediaRecorder.start(250);
        setIsRecording(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const chunk: Transcript = {
            id: Date.now(),
            uuid: data.uuid || Math.random().toString(36).substring(7),
            consultation_id: consultationUuid,
            speaker: data.speaker || "unknown",
            text: data.text,
            timestamp_start: data.timestamp_start || 0,
            timestamp_end: data.timestamp_end,
            confidence: data.confidence,
            created_at: new Date().toISOString(),
          };
          addTranscriptChunk(chunk);
        } catch (err) {
          console.error("Failed to parse websocket transcript payload:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsRecording(false);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Connection error. Please try again.");
        stopRecording();
      };
    } catch (err: any) {
      console.error("Recording start failed:", err);
      setError(
        err.message || "Microphone access denied or connection failed. Please check permissions."
      );
      stopRecording();
      throw err;
    }
  }, [consultationUuid, addTranscriptChunk, stopRecording]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    startRecording,
    stopRecording,
    transcripts,
    isRecording,
    isConnected,
    error,
  };
}
