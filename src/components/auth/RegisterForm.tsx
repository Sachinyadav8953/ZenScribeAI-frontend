"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { authService } from "../../services/authService";
import { useToast } from "../../stores/toastStore";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import Link from "next/link";
import { Specialization } from "../../types";

const registerSchema = zod
  .object({
    full_name: zod.string().min(2, "Full name must be at least 2 characters"),
    email: zod.string().email("Please enter a valid email address"),
    password: zod.string().min(8, "Password must be at least 8 characters"),
    confirm_password: zod.string(),
    role: zod.enum(["doctor", "admin"]),
    specialization: zod.string().optional(),
    license_number: zod.string().optional(),
    hospital_name: zod.string().optional(),
    phone_number: zod
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be between 10 and 15 digits")
      .optional()
      .or(zod.literal("")),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine(
    (data) => {
      if (data.role === "doctor" && !data.specialization) {
        return false;
      }
      return true;
    },
    {
      message: "Specialization is required for doctors",
      path: ["specialization"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "doctor" && (!data.license_number || data.license_number.length < 5)) {
        return false;
      }
      return true;
    },
    {
      message: "License number is required for doctors (min 5 characters)",
      path: ["license_number"],
    }
  );

type RegisterFormValues = zod.infer<typeof registerSchema>;

const specializations: { value: Specialization; label: string }[] = [
  { value: "general_physician", label: "General Physician" },
  { value: "cardiologist", label: "Cardiologist" },
  { value: "neurologist", label: "Neurologist" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "orthopedic", label: "Orthopedic Surgeon" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "gynecologist", label: "Gynecologist" },
  { value: "oncologist", label: "Oncologist" },
  { value: "other", label: "Other" },
];

export function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "doctor",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Clean up fields depending on role before submission
      const submitData = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        role: values.role,
        specialization: values.role === "doctor" ? values.specialization : undefined,
        license_number: values.role === "doctor" ? values.license_number : undefined,
        hospital_name: values.hospital_name || undefined,
        phone_number: values.phone_number || undefined,
      };

      await authService.register(submitData);
      toast.success("Successfully registered! Please log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1 py-1">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Dr. Ramesh Yadav"
          error={!!errors.full_name}
          disabled={isLoading}
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-xs text-red-500 font-medium">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="doctor@hospital.com"
          error={!!errors.email}
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            error={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="••••••••"
            error={!!errors.confirm_password}
            disabled={isLoading}
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-xs text-red-500 font-medium">
              {errors.confirm_password.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <Select id="role" disabled={isLoading} {...register("role")}>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </Select>
        </div>

        {selectedRole === "doctor" && (
          <div className="space-y-1.5">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              id="specialization"
              error={!!errors.specialization}
              disabled={isLoading}
              {...register("specialization")}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </Select>
            {errors.specialization && (
              <p className="text-xs text-red-500 font-medium">
                {errors.specialization.message}
              </p>
            )}
          </div>
        )}
      </div>

      {selectedRole === "doctor" && (
        <div className="space-y-1.5">
          <Label htmlFor="license_number">Medical License Number</Label>
          <Input
            id="license_number"
            placeholder="MCI-12345"
            error={!!errors.license_number}
            disabled={isLoading}
            {...register("license_number")}
          />
          {errors.license_number && (
            <p className="text-xs text-red-500 font-medium">
              {errors.license_number.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="hospital_name">Hospital / Clinic Name</Label>
        <Input
          id="hospital_name"
          placeholder="All India Institute of Medical Sciences (AIIMS)"
          error={!!errors.hospital_name}
          disabled={isLoading}
          {...register("hospital_name")}
        />
        {errors.hospital_name && (
          <p className="text-xs text-red-500 font-medium">{errors.hospital_name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone_number">Phone Number (optional)</Label>
        <Input
          id="phone_number"
          placeholder="+919876543210"
          error={!!errors.phone_number}
          disabled={isLoading}
          {...register("phone_number")}
        />
        {errors.phone_number && (
          <p className="text-xs text-red-500 font-medium">{errors.phone_number.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        Register Account
      </Button>

      <div className="text-center text-xs text-slate-500 mt-4">
        Already registered?{" "}
        <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
          Sign In here
        </Link>
      </div>
    </form>
  );
}
