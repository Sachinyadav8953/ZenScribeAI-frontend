"use client";

import React, { useState } from "react";
import { Consultation } from "../../types";
import { Trash2, ExternalLink, PlayCircle, Search, Edit3, X, Save } from "lucide-react";
import Link from "next/link";
import { consultationService } from "../../services/consultationService";
import { useToast } from "../../stores/toastStore";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ConsultationListTableProps {
  consultations: Consultation[];
  isLoading: boolean;
  onDelete: (uuid: string) => void;
  onUpdate?: (updated: Consultation) => void;
}

export function ConsultationListTable({
  consultations,
  isLoading,
  onDelete,
  onUpdate,
}: ConsultationListTableProps) {
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<"all" | "in_progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("male");
  const [editPhone, setEditPhone] = useState("");
  const [editComplaint, setEditComplaint] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const openEditModal = (c: Consultation) => {
    setEditingConsultation(c);
    setEditName(c.patient_name);
    setEditAge(c.patient_age?.toString() || "");
    setEditGender(c.patient_gender || "male");
    setEditPhone(c.patient_phone || "");
    setEditComplaint(c.chief_complaint || "");
  };

  const closeEditModal = () => {
    setEditingConsultation(null);
  };

  const handleSaveEdit = async () => {
    if (!editingConsultation) return;
    if (!editName.trim()) {
      toast.error("Patient name is required");
      return;
    }

    setIsSavingEdit(true);
    try {
      const updated = await consultationService.update(editingConsultation.uuid, {
        patient_name: editName,
        patient_age: editAge ? Number(editAge) : undefined,
        patient_gender: editGender,
        patient_phone: editPhone || undefined,
        chief_complaint: editComplaint || undefined,
      });

      toast.success("Consultation updated successfully!");
      if (onUpdate) {
        onUpdate(updated);
      }
      closeEditModal();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update consultation details.");
    } finally {
      setIsSavingEdit(false);
    }
  };

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

  const filteredConsultations = consultations.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      c.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.chief_complaint && c.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

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

  return (
    <div className="space-y-4">
      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterStatus === "all"
                ? "bg-white dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            All ({consultations.length})
          </button>
          <button
            onClick={() => setFilterStatus("in_progress")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterStatus === "in_progress"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            In Progress ({consultations.filter((c) => c.status === "in_progress").length})
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterStatus === "completed"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Completed ({consultations.filter((c) => c.status === "completed").length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or complaint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 font-medium">
            {searchQuery || filterStatus !== "all"
              ? "No matching consultations found."
              : "No consultations recorded yet."}
          </p>
          <Link
            href="/consultations/new"
            className="mt-3 inline-flex items-center text-xs font-semibold text-[#2563EB] hover:underline"
          >
            Start a new consultation now &rarr;
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
            <thead>
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Chief Complaint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-[#0F172A] dark:text-slate-100">
              {filteredConsultations.map((c) => (
                <tr key={c.uuid} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">
                    {c.patient_name}
                    {c.patient_age && (
                      <span className="text-xs font-normal text-slate-500 ml-1.5">
                        ({c.patient_age} yrs, {c.patient_gender})
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {c.chief_complaint || "—"}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(c.started_at)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === "in_progress" ? (
                        <Link
                          href={`/consultations/${c.uuid}/room`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2.5 text-xs font-medium text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 transition-colors"
                          title="Enter consultation room"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          Room
                        </Link>
                      ) : (
                        <Link
                          href={`/consultations/${c.uuid}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          title="View details"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Link>
                      )}

                      {/* EDIT BUTTON (Only for in_progress consultations) */}
                      {c.status === "in_progress" && (
                        <button
                          onClick={() => openEditModal(c)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit consultation details"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this consultation?")) {
                            onDelete(c.uuid);
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
      )}

      {/* EDIT CONSULTATION MODAL */}
      {editingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-blue-600" />
                Edit Consultation
              </h3>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Patient Name"
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Age
                  </label>
                  <Input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    placeholder="e.g. 35"
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Gender
                  </label>
                  <Select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="mt-1 text-xs py-0"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Phone Number
                </label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Chief Complaint
                </label>
                <Textarea
                  value={editComplaint}
                  onChange={(e) => setEditComplaint(e.target.value)}
                  placeholder="Describe primary symptoms..."
                  className="mt-1 text-xs min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={closeEditModal}
                disabled={isSavingEdit}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
