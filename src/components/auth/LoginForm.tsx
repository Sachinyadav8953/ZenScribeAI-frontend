"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../stores/toastStore";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyResend, setShowVerifyResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // Import dynamic service to avoid dependency loop
      const { authService } = await import("@/services/authService");
      await authService.resendVerification(userEmail);
      toast.success("Verification link resent! Please check your inbox.");
      setShowVerifyResend(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to resend verification link. Please check your email address."
      );
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setShowVerifyResend(false);
    try {
      await login(values.email, values.password);
      toast.success("Successfully logged in!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const errMsg = err.message || "";
      toast.error(errMsg || "Invalid credentials. Please try again.");
      
      // If error message indicates email needs verification
      if (
        errMsg.toLowerCase().includes("verify") ||
        errMsg.toLowerCase().includes("verification")
      ) {
        setShowVerifyResend(true);
        setUserEmail(values.email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#2563EB] hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
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

      {showVerifyResend && (
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-md text-xs text-[#0f172a] dark:text-slate-200 space-y-2">
          <p className="font-semibold text-[#2563EB]">Email verification required</p>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Please check your inbox. If you did not receive the link, click below to resend it.
          </p>
          <button
            type="button"
            disabled={isResending}
            onClick={handleResendVerification}
            className="text-xs text-[#2563EB] hover:underline font-bold disabled:opacity-50"
          >
            {isResending ? "Resending Link..." : "Resend Verification Link"}
          </button>
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Sign In
      </Button>

      <div className="text-center text-xs text-slate-500 mt-4">
        New to Doctor_zenZ?{" "}
        <Link href="/register" className="text-[#2563EB] font-semibold hover:underline">
          Register here
        </Link>
      </div>
    </form>
  );
}
