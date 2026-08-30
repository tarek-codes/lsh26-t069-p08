"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TableProperties,
  ClipboardList,
  FileSpreadsheet,
  UploadCloud,
  BarChart3,
  Printer,
  GraduationCap,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [flagCounts, setFlagCounts] = useState<{
    optionalLow: number;
    practicalFail: number;
    absent: number;
    total: number;
  }>({
    optionalLow: 0,
    practicalFail: 0,
    absent: 0,
    total: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/v1/checking-lists");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const list = json.data;
          const opt = list.filter((f: any) => f.flagType === "OPTIONAL_LOW").length;
          const prac = list.filter((f: any) => f.flagType === "PRACTICAL_FAIL").length;
          const abs = list.filter((f: any) => f.flagType === "ABSENT").length;
          setFlagCounts({
            optionalLow: opt,
            practicalFail: prac,
            absent: abs,
            total: list.length,
          });
        }
      } catch (err) {
        console.error("Failed to load badge stats", err);
      }
    }
    loadStats();
  }, [pathname]);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Class Results",
      href: "/dashboard/results",
      icon: TableProperties,
      active: pathname.startsWith("/dashboard/results"),
    },
    {
      name: "Checking List",
      href: "/dashboard/checking-lists",
      icon: ClipboardList,
      badge: flagCounts.total > 0 ? flagCounts.total : undefined,
      active: pathname.startsWith("/dashboard/checking-lists"),
    },
    {
      name: "Assign Marks",
      href: "/dashboard/marks-entry",
      icon: FileSpreadsheet,
      active: pathname === "/dashboard/marks-entry",
    },
    {
      name: "Import Marks",
      href: "/dashboard/import",
      icon: UploadCloud,
      active: pathname.startsWith("/dashboard/import"),
    },
    {
      name: "Class Summary",
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      name: "Transcripts",
      href: "/dashboard/reports",
      icon: Printer,
      active: pathname === "/dashboard/reports",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 h-screen sticky top-0 no-print select-none shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
      {/* Brand Logo Header */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-slate-900 flex items-center">
            School<span className="text-blue-600">Engine</span>
          </span>
          <p className="text-[10px] text-slate-400 font-medium">Result &amp; GPA System</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
        {/* Menu Section */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            NAVIGATION
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  item.active
                    ? "bg-blue-50/90 text-blue-700 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      item.active ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      item.active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Dedicated Red Sign Out Button */}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50/70 hover:bg-red-600 hover:text-white border border-red-200/80 transition-all duration-150 shadow-xs group"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </div>

      {/* User Info Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
          SA
        </div>
        <div className="truncate">
          <div className="font-semibold text-xs text-slate-900 leading-tight">System Admin</div>
          <div className="text-[10px] text-slate-500 truncate">Exam Controller Portal</div>
        </div>
      </div>
    </aside>
  );
}
