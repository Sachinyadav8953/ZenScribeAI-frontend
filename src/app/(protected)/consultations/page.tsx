"use client";

import React, { useEffect, useState } from "react";
import { consultationService } from "@/services/consultationService";
import { Consultation } from "@/types";
import { useToast } from "@/stores/toastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultationListTable } from "@/components/consultation/ConsultationListTable";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ConsultationsPage() {
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

  const handleUpdate = (updated: Consultation) => {
    setConsultations((prev) =>
      prev.map((c) => (c.uuid === updated.uuid ? updated : c))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
            Consultations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            View, edit, filter, and manage all your completed and active consultations.
          </p>
        </div>
        <Link href="/consultations/new">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4.5 w-4.5" />
            New Consultation
          </Button>
        </Link>
      </div>

      <Card className="bg-white dark:bg-[#111827] overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100">
            All Medical Records
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
            onUpdate={handleUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
