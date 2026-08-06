"use client";

import React from "react";
import { Consultation } from "../../types";
import { Trash2, ExternalLink, PlayCircle } from "lucide-react";
import Link from "next/link";

interface ConsultationListTableProps {
  consultations: Consultation[];
  isLoading: boolean;
  onDelete: (uuid: string) => void;
}

export function ConsultationListTable({
  consultations,
  isLoading,
  onDelete,
}: ConsultationListTableProps) {
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
            Completed
          </span>
        );
      case "cancelled":
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/10">
            Cancelled
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-slate-100 py-4 animate-pulse"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              <div className="h-3 bg-slate-50 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-100 rounded w-20"></div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 w-8 bg-slate-100 rounded"></div>
              <div className="h-8 w-8 bg-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-slate-100">
        <p className="text-sm text-slate-500 font-medium">No consultations recorded today.</p>
        <Link
          href="/consultations/new"
          className="mt-3 inline-flex items-center text-xs font-semibold text-[#2563EB] hover:underline"
        >
          Start a new consultation now &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-slate-100 text-left">
        <thead>
          <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4">Patient Name</th>
            <th className="py-3 px-4">Chief Complaint</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Date & Time</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm text-[#0F172A]">
          {consultations.map((c) => (
            <tr key={c.uuid} className="hover:bg-slate-50/40 transition-colors">
              <td className="py-3.5 px-4 font-semibold">
                {c.patient_name}
                {c.patient_age && (
                  <span className="text-xs font-normal text-slate-500 ml-1.5">
                    ({c.patient_age} yrs, {c.patient_gender})
                  </span>
                )}
              </td>
              <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                {c.chief_complaint || "—"}
              </td>
              <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>
              <td className="py-3.5 px-4 text-xs text-slate-500">{formatDate(c.started_at)}</td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {c.status === "in_progress" ? (
                    <Link
                      href={`/consultations/${c.uuid}/room`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-50 px-2.5 text-xs font-medium text-[#2563EB] hover:bg-blue-100 transition-colors"
                      title="Enter consultation room"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      Room
                    </Link>
                  ) : (
                    <Link
                      href={`/consultations/${c.uuid}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-100 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      title="View details"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this consultation?")) {
                        onDelete(c.uuid);
                      }
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete consultation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
