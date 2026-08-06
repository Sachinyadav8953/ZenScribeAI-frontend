"use client";

import React, { useEffect, useRef } from "react";
import { Transcript } from "../../types";
import { MessageSquare } from "lucide-react";

interface LiveTranscriptViewProps {
  transcripts: Transcript[];
  isRecording: boolean;
}

export function LiveTranscriptView({ transcripts, isRecording }: LiveTranscriptViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new transcripts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 border border-slate-100 rounded-lg overflow-hidden">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#2563EB]" />
          Live Transcript
        </h4>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
            Live Listening
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-slate-400 p-8">
            <MessageSquare className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
            <p className="text-sm font-medium">
              {isRecording
                ? "Listening... speak into the microphone."
                : "Start recording to see live transcript"}
            </p>
          </div>
        ) : (
          transcripts.map((t) => {
            const isDoctor = t.speaker === "doctor";
            const speakerTag = isDoctor ? "DOCTOR" : "PATIENT";
            const tagBg = isDoctor
              ? "bg-blue-50 text-blue-700 border-blue-100"
              : "bg-slate-100 text-slate-600 border-slate-200";

            return (
              <div key={t.uuid || t.id} className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${tagBg}`}
                  >
                    {speakerTag}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    [{formatTime(t.timestamp_start)}]
                  </span>
                </div>
                <p className="text-sm text-[#0F172A] pl-0.5 leading-relaxed">
                  {t.text}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
