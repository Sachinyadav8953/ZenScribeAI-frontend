import { create } from "zustand";
import { useMemo } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration) => {
    const id = Math.random().toString(36).substring(7);
    const displayDuration = duration ?? (type === "error" ? 5000 : 4000);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto-remove toast after displayDuration (5000ms for errors)
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, displayDuration);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  
  const toast = useMemo(() => {
    const fn = (message: string, type: "success" | "error" | "info" = "info", duration?: number) => {
      addToast(message, type, duration);
    };
    fn.success = (message: string, duration?: number) => addToast(message, "success", duration);
    fn.error = (message: string, duration?: number) => addToast(message, "error", duration || 5000);
    fn.info = (message: string, duration?: number) => addToast(message, "info", duration);
    return fn;
  }, [addToast]);

  return { toast };
}
