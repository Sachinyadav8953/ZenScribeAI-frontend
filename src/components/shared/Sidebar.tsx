"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, User, FileText } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Consultations",
      href: "/consultations",
      icon: FileText,
      active: pathname === "/consultations",
    },
    {
      name: "New Consultation",
      href: "/consultations/new",
      icon: PlusCircle,
      active: pathname === "/consultations/new",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-100 bg-white hidden md:flex flex-col h-[calc(100vh-64px)] py-6 px-4">
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const activeClass = link.active
            ? "bg-blue-50 text-[#2563EB] font-semibold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeClass}`}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
          Doctor_zenZ v1.0.0
        </p>
      </div>
    </aside>
  );
}
