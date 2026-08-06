"use client";

import React, { useState } from "react";
import { Consultation } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Edit2, Save, X, User } from "lucide-react";
import { useConsultation } from "../../hooks/useConsultation";
import { useToast } from "../../stores/toastStore";

interface PatientInfoCardProps {
  consultation: Consultation;
}

export function PatientInfoCard({ consultation }: PatientInfoCardProps) {
  const { updateConsultation } = useConsultation();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState(consultation.patient_name);
  const [age, setAge] = useState(consultation.patient_age?.toString() || "");
  const [gender, setGender] = useState(consultation.patient_gender || "male");
  const [phone, setPhone] = useState(consultation.patient_phone || "");
  const [complaint, setComplaint] = useState(consultation.chief_complaint || "");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    
    setIsLoading(true);
    try {
      await updateConsultation(consultation.uuid, {
        patient_name: name,
        patient_age: age ? Number(age) : undefined,
        patient_gender: gender,
        patient_phone: phone || undefined,
        chief_complaint: complaint || undefined,
      });
      toast.success("Patient details updated!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update patient details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(consultation.patient_name);
    setAge(consultation.patient_age?.toString() || "");
    setGender(consultation.patient_gender || "male");
    setPhone(consultation.patient_phone || "");
    setComplaint(consultation.chief_complaint || "");
    setIsEditing(false);
  };

  const capitalize = (str?: string) => {
    if (!str) return "—";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
      <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-slate-500" />
          <h4 className="text-sm font-semibold text-[#0F172A]">Patient Details</h4>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline font-semibold"
          >
            <Edit2 className="h-3 w-3" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:underline font-semibold"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                <Input
                  className="h-8 text-xs mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Age</label>
                  <Input
                    className="h-8 text-xs mt-1"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Gender</label>
                  <Select
                    className="h-8 text-xs mt-1 py-0"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    disabled={isLoading}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Phone</label>
                <Input
                  className="h-8 text-xs mt-1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Complaint</label>
              <Textarea
                className="text-xs mt-1 min-h-[60px]"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Full Name</p>
                <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                  {consultation.patient_name}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Age / Gender</p>
                <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                  {consultation.patient_age ? `${consultation.patient_age} yrs` : "—"} /{" "}
                  {capitalize(consultation.patient_gender)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {consultation.patient_phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Created At</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(consultation.started_at).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-50">
              <p className="text-[10px] uppercase font-bold text-slate-400">Chief Complaint</p>
              <p className="text-sm text-slate-600 font-medium mt-1 whitespace-pre-line leading-relaxed">
                {consultation.chief_complaint || "No chief complaint recorded."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
