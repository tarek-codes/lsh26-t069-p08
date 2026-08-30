import React from "react";
import { LetterGrade } from "@/engine/types";

interface GradeBadgeProps {
  grade: LetterGrade | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GradeBadge({ grade, size = "md", className = "" }: GradeBadgeProps) {
  let styleClasses = "bg-slate-100 text-slate-700 border-slate-300";

  switch (grade) {
    case "A+":
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-300";
      break;
    case "A":
      styleClasses = "bg-emerald-50/80 text-emerald-600 border-emerald-200";
      break;
    case "A-":
      styleClasses = "bg-teal-50 text-teal-700 border-teal-200";
      break;
    case "B":
      styleClasses = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "C":
      styleClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "D":
      styleClasses = "bg-orange-50 text-orange-700 border-orange-200";
      break;
    case "F":
      styleClasses = "bg-red-50 text-red-700 border-red-300 font-bold";
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-base px-3 py-1 font-bold"
      : "text-xs px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-mono ${styleClasses} ${sizeClasses} ${className}`}
    >
      {grade}
    </span>
  );
}
