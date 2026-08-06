import { create } from "zustand";
import { useMemo } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  
  const toast = useMemo(() => {
    const fn = (message: string, type: "success" | "error" | "info" = "info") => {
      addToast(message, type);
    };
    fn.success = (message: string) => addToast(message, "success");
    fn.error = (message: string) => addToast(message, "error");
    fn.info = (message: string) => addToast(message, "info");
    return fn;
  }, [addToast]);

  return { toast };
}
