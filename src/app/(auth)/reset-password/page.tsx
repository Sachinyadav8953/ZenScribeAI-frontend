import React, { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Reset password
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          Create a new strong password for your account.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center text-xs text-slate-400 py-4 font-medium animate-pulse">
            Loading reset form...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
