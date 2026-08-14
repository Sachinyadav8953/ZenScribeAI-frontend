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
import { AlertCircle } from "lucide-react";

const loginSchema = zod.object({
  license_number: zod.string().min(5, "License number must be at least 5 characters"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(values.license_number, values.password);
      toast.success("Successfully logged in!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      const errMsg = err.message || "Invalid license number or password. Please check your credentials.";
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="license_number">Medical License Number</Label>
        <Input
          id="license_number"
          type="text"
          placeholder="MCI-12345"
          error={!!errors.license_number}
          disabled={isLoading}
          {...register("license_number")}
        />
        {errors.license_number && (
          <p className="text-xs text-red-500 font-medium">{errors.license_number.message}</p>
        )}
      </div>

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

      {/* Forgot password and email verification UI removed */}

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
