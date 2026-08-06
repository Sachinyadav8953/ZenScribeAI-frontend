"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { Loader } from "@/components/shared/Loader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProfile, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initUser() {
      try {
        await fetchProfile();
      } catch (err) {
        console.error("Profile load failed in protected layout:", err);
      } finally {
        setLoading(false);
      }
    }
    initUser();
  }, [fetchProfile]);

  if (loading) {
    return <Loader fullPage message="Verifying session..." />;
  }

  if (!user) {
    return null; // The middleware redirects to /login automatically
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#090d16]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-64px)] bg-slate-50/30 dark:bg-[#090d16]">
          {children}
        </main>
      </div>
    </div>
  );
}
