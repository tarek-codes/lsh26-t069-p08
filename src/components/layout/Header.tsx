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
    <header
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
      className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 no-print"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--fg)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {onClassChange && (
        <div
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          className="flex items-center p-0.5 rounded-lg text-xs"
        >
          {[
            { id: "c1010000-0000-0000-0000-000000000001", label: "Class 9 (30)" },
            { id: "c1010000-0000-0000-0000-000000000002", label: "Class 10 (30)" },
          ].map((cls) => (
            <button
              key={cls.id}
              onClick={() => onClassChange(cls.id)}
              style={
                activeClassId === cls.id
                  ? {
                      backgroundColor: "var(--accent)",
                      color: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }
                  : { color: "var(--fg-muted)" }
              }
              className="px-3 py-1.5 rounded-md font-medium transition-all hover:text-[var(--fg)]"
            >
              {cls.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
