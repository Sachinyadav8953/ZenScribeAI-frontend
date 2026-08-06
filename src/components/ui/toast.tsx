"use client";

import React from "react";
import { useToastStore } from "../../stores/toastStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const bgStyles = "bg-white border border-slate-100 shadow-lg rounded-lg pointer-events-auto";
        
        let Icon = Info;
        let iconColor = "text-[#2563EB]";

        if (toast.type === "success") {
          Icon = CheckCircle;
          iconColor = "text-emerald-500";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-red-500";
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 transition-all duration-300 transform translate-x-0 ${bgStyles}`}
            role="alert"
          >
            <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-sm font-medium text-slate-800">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
