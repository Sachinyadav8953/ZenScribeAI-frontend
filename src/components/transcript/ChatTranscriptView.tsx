import React from "react";
import { Transcript } from "../../types";

interface ChatTranscriptViewProps {
  transcripts: Transcript[];
}

export function ChatTranscriptView({ transcripts }: ChatTranscriptViewProps) {
  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 py-2">
      {transcripts.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-8">
          No transcript details recorded for this session.
        </p>
      ) : (
        transcripts.map((t) => {
          const isDoctor = t.speaker === "doctor";
          return (
            <div
              key={t.uuid || t.id}
              className={`flex ${isDoctor ? "justify-start" : "justify-end"} w-full`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm border ${
                  isDoctor
                    ? "bg-blue-50/20 border-blue-100/50 text-left"
                    : "bg-slate-50/50 border-slate-100 text-left"
                } flex flex-col gap-1`}
              >
                <div className={`flex items-center gap-2 ${isDoctor ? "justify-start" : "flex-row-reverse"}`}>
                  <span
                    className={`text-[10px] font-bold tracking-wider ${
                      isDoctor ? "text-[#2563EB]" : "text-slate-500"
                    }`}
                  >
                    {isDoctor ? "DOCTOR" : "PATIENT"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold">
                    [{formatTime(t.timestamp_start)}]
                  </span>
                </div>
                <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-line">
                  {t.text}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
