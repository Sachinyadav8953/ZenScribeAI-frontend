"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useConsultation } from "../../hooks/useConsultation";
import { useToast } from "../../stores/toastStore";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

const consultationSchema = zod.object({
  patient_name: zod.string().min(2, "Patient name must be at least 2 characters"),
  patient_age: zod
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 120), {
      message: "Age must be a number between 0 and 120",
    }),
  patient_gender: zod.enum(["male", "female", "other"]).optional().or(zod.literal("")),
  patient_phone: zod
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be between 10 and 15 digits")
    .optional()
    .or(zod.literal("")),
  chief_complaint: zod.string().max(500, "Complaint note must be under 500 characters").optional(),
});

type ConsultationFormValues = zod.infer<typeof consultationSchema>;

export function NewConsultationForm() {
  const { createConsultation, isLoading } = useConsultation();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patient_gender: "male",
      patient_age: "",
    },
  });

  const onSubmit = async (values: ConsultationFormValues) => {
    try {
      const payload = {
        patient_name: values.patient_name,
        patient_age: values.patient_age ? Number(values.patient_age) : undefined,
        patient_gender: values.patient_gender || undefined,
        patient_phone: values.patient_phone || undefined,
        chief_complaint: values.chief_complaint || undefined,
      };

      const consultation = await createConsultation(payload);
      toast.success("Consultation started!");
      router.push(`/consultations/${consultation.uuid}/room`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create consultation.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="patient_name">Patient Full Name *</Label>
        <Input
          id="patient_name"
          placeholder="Ramesh Yadav"
          error={!!errors.patient_name}
          disabled={isLoading}
          {...register("patient_name")}
        />
        {errors.patient_name && (
          <p className="text-xs text-red-500 font-medium">{errors.patient_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="patient_age">Age (years)</Label>
          <Input
            id="patient_age"
            type="number"
            placeholder="45"
            error={!!errors.patient_age}
            disabled={isLoading}
            {...register("patient_age")}
          />
          {errors.patient_age && (
            <p className="text-xs text-red-500 font-medium">{errors.patient_age.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="patient_gender">Gender</Label>
          <Select
            id="patient_gender"
            disabled={isLoading}
            {...register("patient_gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="patient_phone">Phone Number</Label>
        <Input
          id="patient_phone"
          placeholder="+919876543210"
          error={!!errors.patient_phone}
          disabled={isLoading}
          {...register("patient_phone")}
        />
        {errors.patient_phone && (
          <p className="text-xs text-red-500 font-medium">{errors.patient_phone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="chief_complaint">Chief Complaint</Label>
        <Textarea
          id="chief_complaint"
          placeholder="Describe symptoms, e.g., fever and chest pain since 2 days"
          rows={4}
          error={!!errors.chief_complaint}
          disabled={isLoading}
          {...register("chief_complaint")}
        />
        {errors.chief_complaint && (
          <p className="text-xs text-red-500 font-medium">
            {errors.chief_complaint.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto px-8" isLoading={isLoading}>
        Start Consultation
      </Button>
    </form>
  );
}
