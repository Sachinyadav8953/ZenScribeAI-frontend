import React from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Reset password
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          Enter your email address and we'll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
