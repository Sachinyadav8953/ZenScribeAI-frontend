"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/stores/toastStore";
import { User, Shield, Briefcase, Award, CheckCircle, XCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const formatSpecialization = (spec?: string) => {
    if (!spec) return "Not specified";
    return spec
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsChangingPassword(true);
    // Simulate endpoint request
    setTimeout(() => {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
          Doctor Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Review credentials and configure account security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Identity & Medical Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Full Name
                  </Label>
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-slate-200 mt-1">
                    Dr. {user.full_name}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    License Number
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {user.license_number || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Role Workspace
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1 uppercase flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-[#2563EB]" />
                    {user.role}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Medical Specialization
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-[#2563EB]" />
                    {formatSpecialization(user.specialization)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    License Number
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-[#2563EB]" />
                    {user.license_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Verification Status
                  </Label>
                  <div className="mt-1">
                    {user.license_verified ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
                        <XCircle className="h-3 w-3" />
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Hospital Name
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {user.hospital_name || "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-slate-400">
                    Phone Number
                  </Label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {user.phone_number || "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change password panel */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#111827] dark:border-slate-800 shadow-sm border border-slate-100 dark:border-slate-800">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Update account passwords.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="old_password">Current Password</Label>
                  <Input
                    id="old_password"
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-xs font-semibold"
                  isLoading={isChangingPassword}
                >
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
