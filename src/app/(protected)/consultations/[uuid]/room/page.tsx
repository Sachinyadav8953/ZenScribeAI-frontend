"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConsultation } from "@/hooks/useConsultation";
import { useAudioStream } from "@/hooks/useAudioStream";
import { useToast } from "@/stores/toastStore";
import { PatientInfoCard } from "@/components/consultation/PatientInfoCard";
import { LiveTranscriptView } from "@/components/transcript/LiveTranscriptView";
import { Loader } from "@/components/shared/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Power, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ConsultationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const uuid = params.uuid as string;

  const {
    currentConsultation,
    fetchConsultation,
    endConsultation,
    clearConsultation,
    isLoading: isConsultationLoading,
  } = useConsultation();

  const {
    startRecording,
    stopRecording,
    transcripts,
    isRecording,
    isConnected,
    error: streamError,
  } = useAudioStream(uuid);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isEnding, setIsEnding] = useState(false);

  // Hydrate consultation data on mount
  useEffect(() => {
    if (uuid) {
      fetchConsultation(uuid).catch(() => {
        toast.error("Failed to load consultation room details.");
        router.push("/dashboard");
      });
    }
    return () => {
      clearConsultation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  // Handle stream errors
  useEffect(() => {
    if (streamError) {
      toast.error(streamError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamError]);

  // Duration Timer logic
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isRecording) {
      timerInterval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isRecording]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return [
      hrs > 0 ? hrs.toString().padStart(2, "0") : null,
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      stopRecording();
      toast.info("Recording paused.");
    } else {
      try {
        await startRecording();
        toast.success("Recording started successfully!");
      } catch (err) {
        // Error toast is handled by streamError effect
      }
    }
  };

  const handleEndConsultation = async () => {
    if (confirm("Are you sure you want to end this consultation? This will close the recording session.")) {
      setIsEnding(true);
      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
      try {
        await endConsultation(uuid);
        toast.success("Consultation session completed!");
        router.push(`/consultations/${uuid}`);
      } catch (err: any) {
        toast.error(err.message || "Failed to finalize consultation.");
        setIsEnding(false);
      }
    }
  };

  if (isConsultationLoading || !currentConsultation) {
    return <Loader fullPage message="Entering room workspace..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          onClick={() => {
            if (isRecording) {
              return confirm("Recording is active. Leaving this page will pause recording. Continue?");
            }
            return true;
          }}
          className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
            Consultation Room
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Scribe Workspace &middot; UUID: {currentConsultation.uuid}
          </p>
        </div>
      </div>

      {/* Split panel workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* LEFT PANEL: 40% (4 grid cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Details Card */}
          <PatientInfoCard consultation={currentConsultation} />

          {/* Status & Timer Card */}
          <Card className="bg-white dark:bg-[#111827] border-slate-100 dark:border-slate-800 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Status
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/20 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB]">
                  {currentConsultation.status === "in_progress" ? "Active" : currentConsultation.status}
                </span>
              </div>

              {/* Timer UI */}
              <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Consultation Duration
                </p>
                <p className="text-3xl font-extrabold font-mono text-[#0F172A] dark:text-slate-100 mt-1">
                  {formatTimer(timerSeconds)}
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleToggleRecord}
                  disabled={isEnding}
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 transform active:scale-95 shadow-md ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-[#2563EB] hover:bg-blue-700 text-white"
                  }`}
                  title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                  {isRecording ? (
                    <Square className="h-6 w-6 fill-white" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </button>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {isRecording
                    ? isConnected
                      ? "Connected to Server (Recording)"
                      : "Connecting WebSocket..."
                    : "Microphone Paused"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* End Consultation Action */}
          <Button
            variant="danger"
            onClick={handleEndConsultation}
            isLoading={isEnding}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Power className="h-4 w-4" />
            End Consultation
          </Button>
        </div>

        {/* RIGHT PANEL: 60% (6 grid cols) */}
        <div className="lg:col-span-6">
          <LiveTranscriptView transcripts={transcripts} isRecording={isRecording} />
        </div>
      </div>
    </div>
  );
}
