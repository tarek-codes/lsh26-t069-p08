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
import { ThemeToggle } from "@/components/common/ThemeToggle";

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
            total: json.summary?.totalFlagged ?? new Set(list.map((f: any) => f.studentId)).size,
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
    <aside className="w-60 flex flex-col shrink-0 h-screen sticky top-0 no-print select-none bg-[var(--surface)] border-r border-[var(--border)]">
      <Link href="/dashboard" className="h-24 px-5 pt-6 pb-2 flex items-center gap-2.5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-[18px] h-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm tracking-tight leading-tight text-[var(--fg)]">
            School<span className="text-[var(--accent)]">Engine</span>
          </p>
          <p className="text-[11px] leading-tight text-[var(--fg-subtle)] truncate">Result &amp; GPA system</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 pt-6 pb-4 overflow-y-auto">
        <p className="px-3 mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">Workspace</p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`group flex items-center gap-3.5 h-11 px-3.5 rounded-full text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-[var(--accent)] text-white font-semibold shadow-sm"
                      : "text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      item.active ? "text-white" : "text-[var(--fg-subtle)] group-hover:text-[var(--fg-muted)]"
                    }`}
                  />
                  <span className="flex-1 truncate tracking-tight">{item.name}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-semibold tabular-nums shrink-0 ${
                        item.active
                          ? "bg-white text-[var(--accent)]"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-2.5 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-semibold text-xs shrink-0">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium leading-tight truncate text-[var(--fg)]">System Admin</p>
            <p className="text-[10px] leading-tight truncate text-[var(--fg-subtle)]">Exam controller</p>
          </div>
          <ThemeToggle />
          <Link
            href="/login"
            aria-label="Sign out"
            title="Sign out"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-subtle)] hover:text-red-500 hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
