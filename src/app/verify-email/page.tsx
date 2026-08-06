"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/stores/toastStore";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/shared/Loader";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/axios";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Verification token is missing from the URL.");
      return;
    }

    async function verify() {
      try {
        // Direct call to API proxy route mapping to GET http://localhost:8000/auth/verify-email?token={token}
        await api.get("/auth/verify-email", {
          params: { token },
        });
        setStatus("success");
        toast.success("Email verified successfully! Redirecting to login...");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err.response?.data?.detail || "Email verification failed. The link may have expired."
        );
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Loader message="Verifying your email address..." />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
        <h3 className="text-lg font-bold text-[#0F172A]">Email Verified!</h3>
        <p className="text-sm text-slate-500 font-medium">
          Your account is now active. Redirecting you to the login page...
        </p>
        <Link href="/login" className="text-sm text-[#2563EB] hover:underline font-semibold">
          Click here to log in directly
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <XCircle className="h-12 w-12 text-red-500" />
      <h3 className="text-lg font-bold text-[#0F172A]">Verification Failed</h3>
      <p className="text-sm text-red-600 font-semibold leading-relaxed">
        {errorMessage}
      </p>
      <p className="text-xs text-slate-400 font-medium">
        You can request a new verification link by attempting to log in with your credentials on the login screen.
      </p>
      <Link href="/login" className="text-sm text-[#2563EB] hover:underline font-semibold">
        Return to Login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white border border-slate-100 shadow-sm sm:rounded-lg">
          <CardContent className="p-6">
            <Suspense fallback={<Loader message="Initializing verification..." />}>
              <VerifyEmailContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
