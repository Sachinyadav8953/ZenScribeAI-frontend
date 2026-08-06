import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NewConsultationForm } from "@/components/consultation/NewConsultationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewConsultationPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          New Consultation
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Initiate a new patient scribe recording.
        </p>
      </div>

      <Card className="bg-white dark:bg-[#111827] dark:border-slate-800">
        <CardHeader>
          <CardTitle>Patient Scribe Setup</CardTitle>
          <CardDescription>
            Provide patient details to start recording the visit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewConsultationForm />
        </CardContent>
      </Card>
    </div>
  );
}
