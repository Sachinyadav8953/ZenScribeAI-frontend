"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { authService } from "../../services/authService";
import { useToast } from "../../stores/toastStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

const forgotSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type ForgotFormValues = zod.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values.email);
      toast.success("Reset link sent successfully!");
      setIsSent(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Could not request password reset. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-slate-600">
          We have sent a password reset link to your email address. Please check your inbox (and spam folder).
        </p>
        <Link
          href="/login"
          className="inline-flex text-sm text-[#2563EB] hover:underline font-semibold"
        >
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Send Reset Link
      </Button>

      <div className="text-center text-xs text-slate-500 mt-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}
