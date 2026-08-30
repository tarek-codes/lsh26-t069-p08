import React from "react";
import { LetterGrade } from "@/engine/types";

interface GradeBadgeProps {
  grade: LetterGrade | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GradeBadge({ grade, size = "md", className = "" }: GradeBadgeProps) {
  // Use inline styles for dark-mode compatibility via CSS tokens
  let styleProps: React.CSSProperties = {};
  let extraClass = "";

  switch (grade) {
    case "A+":
      styleProps = { backgroundColor: "rgba(5,150,105,0.12)", color: "#059669", borderColor: "rgba(5,150,105,0.35)" };
      break;
    case "A":
      styleProps = { backgroundColor: "rgba(16,185,129,0.10)", color: "#10b981", borderColor: "rgba(16,185,129,0.30)" };
      break;
    case "A-":
      styleProps = { backgroundColor: "rgba(13,148,136,0.10)", color: "#0d9488", borderColor: "rgba(13,148,136,0.30)" };
      break;
    case "B":
      styleProps = { backgroundColor: "rgba(37,99,235,0.10)", color: "#2563eb", borderColor: "rgba(37,99,235,0.30)" };
      break;
    case "C":
      styleProps = { backgroundColor: "rgba(217,119,6,0.10)", color: "#d97706", borderColor: "rgba(217,119,6,0.30)" };
      break;
    case "D":
      styleProps = { backgroundColor: "rgba(234,88,12,0.10)", color: "#ea580c", borderColor: "rgba(234,88,12,0.30)" };
      break;
    case "F":
      styleProps = { backgroundColor: "rgba(220,38,38,0.12)", color: "#dc2626", borderColor: "rgba(220,38,38,0.35)" };
      extraClass = "font-bold";
      break;
    default:
      styleProps = { backgroundColor: "var(--bg-subtle)", color: "var(--fg-muted)", borderColor: "var(--border)" };
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-base px-3 py-1 font-bold"
      : "text-xs px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-mono ${sizeClasses} ${extraClass} ${className}`}
      style={styleProps}
    >
      {grade}
    </span>
  );
}
