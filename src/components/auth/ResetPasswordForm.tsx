"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "../../services/authService";
import { useToast } from "../../stores/toastStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

const resetSchema = zod
  .object({
    new_password: zod.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: zod.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

type ResetFormValues = zod.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      toast.error("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        new_password: values.new_password,
        confirm_new_password: values.confirm_new_password,
      });
      toast.success("Password has been reset successfully. Please log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to reset password. The link may have expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!token && (
        <div className="p-3 bg-red-50 border border-red-100 rounded text-xs text-red-600 font-medium">
          Warning: Reset token not detected in URL query. Ensure you clicked the link from your email correctly.
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="new_password">New Password</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="••••••••"
          error={!!errors.new_password}
          disabled={isLoading || !token}
          {...register("new_password")}
        />
        {errors.new_password && (
          <p className="text-xs text-red-500 font-medium">{errors.new_password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm_new_password">Confirm New Password</Label>
        <Input
          id="confirm_new_password"
          type="password"
          placeholder="••••••••"
          error={!!errors.confirm_new_password}
          disabled={isLoading || !token}
          {...register("confirm_new_password")}
        />
        {errors.confirm_new_password && (
          <p className="text-xs text-red-500 font-medium">
            {errors.confirm_new_password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading} disabled={!token}>
        Update Password
      </Button>

      <div className="text-center text-xs text-slate-500 mt-4">
        Go back to{" "}
        <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}
