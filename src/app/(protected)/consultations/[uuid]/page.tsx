"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConsultation } from "@/hooks/useConsultation";
import { useToast } from "@/stores/toastStore";
import { PatientInfoCard } from "@/components/consultation/PatientInfoCard";
import { ChatTranscriptView } from "@/components/transcript/ChatTranscriptView";
import { Loader } from "@/components/shared/Loader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, CheckCircle2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { soapService } from "@/services/soapService";
import { SoapNote } from "@/types";

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const uuid = params.uuid as string;

  const {
    currentConsultation,
    fetchConsultation,
    clearConsultation,
    isLoading,
  } = useConsultation();

  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [loadingSoap, setLoadingSoap] = useState(true);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);

  useEffect(() => {
    if (uuid) {
      fetchConsultation(uuid)
        .then(() => {
          return soapService.get(uuid);
        })
        .then((note) => {
          setSoapNote(note);
        })
        .catch((err) => {
          // If SOAP note does not exist (404), that's fine. Otherwise log it.
          if (err.response?.status !== 404) {
            console.error("Error fetching SOAP note:", err);
            toast.error("Failed to load SOAP note details.");
          }
        })
        .finally(() => {
          setLoadingSoap(false);
        });
    }
    return () => {
      clearConsultation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleGenerateSoap = async () => {
    setIsGeneratingSoap(true);
    try {
      const note = await soapService.generate(uuid);
      setSoapNote(note);
      toast.success("AI SOAP note generated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to generate SOAP note. Make sure there are transcripts for this session.";
      toast.error(msg);
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const handleApproveSoap = async () => {
    try {
      const note = await soapService.approve(uuid);
      setSoapNote(note);
      toast.success("SOAP note approved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to approve SOAP note.");
    }
  };

  const formatDuration = (start?: string, end?: string) => {
    if (!start || !end) return "—";
    const diff = Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 1000
    );
    if (diff <= 0) return "0s";
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading || !currentConsultation) {
    return <Loader fullPage message="Loading session details..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full font-semibold border border-emerald-100/50 dark:border-emerald-900/30 w-fit">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Session Saved
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Consultation Summary
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Review transcribed dialog and medical summary charts.
        </p>
      </div>

      {/* Patient info details */}
      <PatientInfoCard consultation={currentConsultation} />

      {/* Metadata & Summary details cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 shadow-sm md:col-span-1">
          <CardHeader className="py-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-medium">
            <div className="flex items-center gap-3">
              <Calendar className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                  Date
                </p>
                <p className="text-slate-800 dark:text-slate-200 mt-1">
                  {formatDate(currentConsultation.started_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/50 pt-3">
              <Clock className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                  Duration
                </p>
                <p className="text-slate-800 dark:text-slate-200 mt-1">
                  {formatDuration(currentConsultation.started_at, currentConsultation.ended_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI SOAP NOTES DYNAMIC CARD */}
        <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 shadow-sm md:col-span-2">
          <CardHeader className="py-4 border-b border-slate-50 dark:border-slate-800/50">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#2563EB]" />
                AI SOAP Note
              </span>
              {soapNote && (
                soapNote.is_approved ? (
                  <span className="normal-case text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                    Approved
                  </span>
                ) : (
                  <Button size="sm" onClick={handleApproveSoap} className="h-7 text-xs px-3">
                    Approve SOAP Note
                  </Button>
                )
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loadingSoap ? (
              <div className="flex justify-center items-center min-h-[140px]">
                <Loader message="Loading SOAP note..." />
              </div>
            ) : soapNote ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Subjective (S)</h4>
                  <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded border border-slate-100/50 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                    {soapNote.subjective || "No subjective notes recorded."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Objective (O)</h4>
                  <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded border border-slate-100/50 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                    {soapNote.objective || "No objective observations recorded."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Assessment (A)</h4>
                  <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded border border-slate-100/50 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                    {soapNote.assessment || "No diagnosis or clinical assessment recorded."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Plan (P)</h4>
                  <p className="text-sm mt-1 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded border border-slate-100/50 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                    {soapNote.plan || "No plan or prescriptions recorded."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[180px] text-center">
                <Sparkles className="h-8 w-8 text-blue-500 animate-pulse mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No SOAP note generated yet
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4 leading-relaxed">
                  Generate an AI-powered SOAP note from the consultation transcript.
                </p>
                <Button 
                  onClick={handleGenerateSoap} 
                  isLoading={isGeneratingSoap}
                  disabled={currentConsultation.status !== "completed"}
                >
                  Generate AI SOAP Note
                </Button>
                {currentConsultation.status !== "completed" && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-2">
                    * The session must be completed/ended before you can generate SOAP notes.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FULL CHAT TRANSCRIPT LOG */}
      <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 py-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Full Consultation Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ChatTranscriptView transcripts={currentConsultation.transcripts || []} />
        </CardContent>
      </Card>
    </div>
  );
}
