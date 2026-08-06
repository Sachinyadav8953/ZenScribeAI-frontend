import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Create your account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          Register to begin recording consultations and generating notes.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}
