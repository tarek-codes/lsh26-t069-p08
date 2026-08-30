import React from "react";

interface StatusBadgeProps {
  status: "PASSED" | "FAILED" | "PENDING" | "VERIFIED" | "CORRECTION_REQUIRED" | "HIGH" | "MEDIUM" | "LOW" | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const text = label || status.replace("_", " ");
  let color = "bg-slate-100 text-slate-700 border-slate-200";

  if (status === "PASSED" || status === "VERIFIED") {
    color = "bg-emerald-50 text-emerald-700 border-emerald-300";
  } else if (status === "FAILED" || status === "HIGH" || status === "CORRECTION_REQUIRED") {
    color = "bg-red-50 text-red-700 border-red-300";
  } else if (status === "PENDING" || status === "MEDIUM") {
    color = "bg-amber-50 text-amber-700 border-amber-300";
  } else if (status === "LOW") {
    color = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${color} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "PASSED" || status === "VERIFIED"
            ? "bg-emerald-500"
            : status === "FAILED" || status === "HIGH" || status === "CORRECTION_REQUIRED"
            ? "bg-red-500"
            : "bg-amber-500"
        }`}
      />
      {text}
    </span>
  );
}
