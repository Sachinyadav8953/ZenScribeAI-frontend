import React from "react";
import { Activity } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-[#090d16]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link href="/login" className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2563EB]/10 text-[#2563EB]">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
            Doctor_zenZ
          </span>
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#111827] px-6 py-8 border border-slate-100 dark:border-slate-800 shadow-sm sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
