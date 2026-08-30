"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative w-8 h-8 flex items-center justify-center rounded-lg
        border transition-all duration-200 cursor-pointer
        border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)]
        hover:border-[var(--border-strong)] hover:text-[var(--fg)]
        focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2
        ${className}
      `}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );
}
