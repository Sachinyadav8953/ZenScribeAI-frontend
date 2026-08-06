import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Sign in to your account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          Enter your credentials to access the scribe workspace.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
