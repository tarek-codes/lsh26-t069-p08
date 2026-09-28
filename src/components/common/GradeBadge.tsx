import React from "react";
import { LetterGrade } from "@/engine/types";

interface GradeBadgeProps {
  grade: LetterGrade | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const GRADE_VARS: Record<string, string> = {
  "A+": "--grade-aplus",
  A: "--grade-a",
  "A-": "--grade-aminus",
  B: "--grade-b",
  C: "--grade-c",
  D: "--grade-d",
  F: "--grade-f",
};

export function GradeBadge({ grade, size = "md", className = "" }: GradeBadgeProps) {
  const cssVar = GRADE_VARS[grade];
  const style: React.CSSProperties = cssVar
    ? {
        color: `var(${cssVar})`,
        backgroundColor: `color-mix(in srgb, var(${cssVar}) 12%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(${cssVar}) 28%, transparent)`,
      }
    : {
        color: "var(--fg-muted)",
        backgroundColor: "var(--bg-subtle)",
        boxShadow: "inset 0 0 0 1px var(--border)",
      };

  const sizeClasses =
    size === "sm"
      ? "h-5 min-w-6 px-1.5 text-[11px]"
      : size === "lg"
      ? "h-8 min-w-10 px-2.5 text-sm"
      : "h-6 min-w-8 px-2 text-xs";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-semibold tabular-nums leading-none ${sizeClasses} ${className}`}
      style={style}
    >
      {grade}
    </span>
  );
}
