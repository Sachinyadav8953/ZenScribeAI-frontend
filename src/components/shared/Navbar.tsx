"use client";

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User as UserIcon, Activity } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  const formatSpecialization = (spec?: string) => {
    if (!spec) return "";
    return spec
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2563EB]/10 text-[#2563EB]">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">
              Doctor_zenZ
            </span>
          </Link>
          <span className="hidden md:inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500 border border-slate-100 ml-2">
            Ambient Scribe
          </span>
        </div>

        {/* Doctor Info & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-[#0F172A]">
                Dr. {user.full_name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {formatSpecialization(user.specialization)}
              </span>
            </div>
          )}
          
          <div className="h-8 w-px bg-slate-100 hidden sm:block" />

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Profile"
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          <button
            onClick={logout}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md border border-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
