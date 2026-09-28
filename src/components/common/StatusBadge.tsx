import React from "react";

interface StatusBadgeProps {
  status: "PASSED" | "FAILED" | "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED" | "HIGH" | "MEDIUM" | "LOW" | string;
  label?: string;
  className?: string;
}

const TONES = {
  success: { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  danger: { chip: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  warning: { chip: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  info: { chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  neutral: { chip: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

function toneFor(status: string) {
  if (status === "PASSED" || status === "VERIFIED") return TONES.success;
  if (status === "FAILED" || status === "HIGH" || status === "CORRECTION_REQUIRED") return TONES.danger;
  if (status === "PENDING" || status === "MEDIUM") return TONES.warning;
  if (status === "LOW") return TONES.info;
  return TONES.neutral;
}

function humanize(status: string) {
  const s = status.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const tone = toneFor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${tone.chip} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {label || humanize(status)}
    </span>
  );
}
