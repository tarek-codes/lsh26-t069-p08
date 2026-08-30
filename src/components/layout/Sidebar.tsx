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
    <aside
      style={{
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
      className="w-64 flex flex-col flex-shrink-0 h-screen sticky top-0 no-print select-none"
    >
      {/* Brand */}
      <div
        style={{ borderBottom: "1px solid var(--border)" }}
        className="px-5 py-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-sm tracking-tight leading-none" style={{ color: "var(--fg)" }}>
            School<span style={{ color: "var(--accent)" }}>Engine</span>
          </p>
          <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--fg-subtle)" }}>
            Result &amp; GPA System
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p
          className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3"
          style={{ color: "var(--fg-subtle)" }}
        >
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              style={
                item.active
                  ? {
                      backgroundColor: "var(--accent-subtle)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-border)",
                    }
                  : {
                      color: "var(--fg-muted)",
                      border: "1px solid transparent",
                    }
              }
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="w-4 h-4"
                  style={{ color: item.active ? "var(--accent)" : "var(--fg-subtle)" }}
                />
                {item.name}
              </div>
              {item.badge !== undefined && (
                <span
                  style={
                    item.active
                      ? { backgroundColor: "var(--accent)", color: "white" }
                      : {
                          backgroundColor: "var(--bg-subtle)",
                          color: "var(--fg-muted)",
                          border: "1px solid var(--border)",
                        }
                  }
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom: theme toggle + sign out + user info */}
      <div style={{ borderTop: "1px solid var(--border)" }} className="p-3 space-y-2">
        {/* Theme toggle row */}
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--fg-subtle)" }}>
            Appearance
          </span>
          <ThemeToggle />
        </div>

        {/* Sign Out */}
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group"
          style={{
            color: "#dc2626",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#dc2626";
            (e.currentTarget as HTMLElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2";
            (e.currentTarget as HTMLElement).style.color = "#dc2626";
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>

        {/* User info */}
        <div
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
            SA
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold leading-tight truncate" style={{ color: "var(--fg)" }}>
              System Admin
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--fg-subtle)" }}>
              Exam Controller Portal
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
