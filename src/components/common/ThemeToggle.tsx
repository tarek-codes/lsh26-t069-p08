"use client";

import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 light:border-slate-300 light:bg-white light:text-slate-700 light:hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center ${className}`}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
