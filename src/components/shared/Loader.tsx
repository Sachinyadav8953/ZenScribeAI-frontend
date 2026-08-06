import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  fullPage?: boolean;
  message?: string;
}

export function Loader({ fullPage = false, message = "Loading..." }: LoaderProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
          <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full">
      <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
    </div>
  );
}
