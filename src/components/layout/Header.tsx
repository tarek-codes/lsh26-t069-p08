"use client";

import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  activeClassId?: string;
  onClassChange?: (classId: string) => void;
}

export function Header({
  title,
  subtitle,
  activeClassId,
  onClassChange,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 no-print">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Class Cohort Switcher */}
        {onClassChange && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onClassChange("c1010000-0000-0000-0000-000000000001")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeClassId === "c1010000-0000-0000-0000-000000000001"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Class 9 (30)
            </button>
            <button
              onClick={() => onClassChange("c1010000-0000-0000-0000-000000000002")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeClassId === "c1010000-0000-0000-0000-000000000002"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Class 10 (30)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
