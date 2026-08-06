"use client";

import React, { useEffect, useState } from "react";
import { consultationService } from "@/services/consultationService";
import { Consultation } from "@/types";
import { useToast } from "@/stores/toastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultationListTable } from "@/components/consultation/ConsultationListTable";
import { Plus, Users, Play, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await consultationService.getAll();
      data.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
      setConsultations(data);
    } catch (err: any) {
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleDelete = async (uuid: string) => {
    try {
      await consultationService.delete(uuid);
      toast.success("Consultation deleted successfully");
      setConsultations((prev) => prev.filter((c) => c.uuid !== uuid));
    } catch (err: any) {
      toast.error("Failed to delete consultation");
    }
  };

  const todayStr = new Date().toDateString();
  const consultationsToday = consultations.filter(
    (c) => new Date(c.started_at).toDateString() === todayStr
  );

  const totalToday = consultationsToday.length;
  const inProgressCount = consultations.filter((c) => c.status === "in_progress").length;
  const completedToday = consultationsToday.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
            Consultations Workspace
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Review recent transcripts, update patient charts, and record live sessions.
          </p>
        </div>
        <Link href="/consultations/new">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4.5 w-4.5" />
            New Consultation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-[#111827] dark:border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Total Today
              </p>
              <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-slate-100">
                {totalToday}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111827] dark:border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                In Progress
              </p>
              <h3 className="text-3xl font-extrabold text-[#2563EB]">
                {inProgressCount}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-[#2563EB] border border-blue-100/50 dark:border-blue-900/30">
              <Play className="h-4.5 w-4.5 fill-[#2563EB]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 col-span-1 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Completed Today
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-600">
                {completedToday}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 border border-emerald-100/50 dark:border-emerald-900/30">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-[#111827] overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100">
            Recent Consultations
          </h3>
          <button
            onClick={loadConsultations}
            className="text-xs text-[#2563EB] hover:underline font-semibold"
          >
            Refresh
          </button>
        </div>
        <CardContent className="p-6">
          <ConsultationListTable
            consultations={consultations}
            isLoading={loading}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
