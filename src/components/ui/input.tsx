import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", error, ...props }, ref) => {
    const errorStyles = error
      ? "border-red-500 focus-visible:ring-red-500"
      : "border-slate-200 focus-visible:ring-blue-600";

    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-[#0F172A] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${errorStyles} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
