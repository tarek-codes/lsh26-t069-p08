"use client";

import React from "react";

export const CLASS_OPTIONS = [
  { id: "c1010000-0000-0000-0000-000000000001", label: "Class 9", count: 30 },
  { id: "c1010000-0000-0000-0000-000000000002", label: "Class 10", count: 30 },
];

interface HeaderProps {
  title: string;
  subtitle?: string;
  activeClassId?: string;
  onClassChange?: ((classId: string) => void) | ((classId: string | undefined) => void);
  /** Adds an "All classes" option that passes `undefined` to onClassChange. */
  showAllOption?: boolean;
  actions?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  activeClassId,
  onClassChange,
  showAllOption = false,
  actions,
}: HeaderProps) {
  const options = [
    ...(showAllOption ? [{ id: undefined, label: "All classes", count: 60 }] : []),
    ...CLASS_OPTIONS,
  ];

  return (
    <header className="sticky top-0 z-20 no-print shrink-0 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md">
      <div className="min-h-16 px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold tracking-tight leading-tight text-[var(--fg)]">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-[13px] leading-snug text-[var(--fg-muted)] max-w-3xl">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onClassChange && (
            <div role="tablist" aria-label="Select class" className="segmented">
              {options.map((cls) => (
                <button
                  key={cls.id ?? "all"}
                  role="tab"
                  aria-selected={activeClassId === cls.id}
                  onClick={() => (onClassChange as (id: string | undefined) => void)(cls.id)}
                >
                  {cls.label}
                  <span className="ml-1.5 tabular-nums text-[var(--fg-subtle)]">{cls.count}</span>
                </button>
              ))}
            </div>
          )}
          {actions}
        </div>
      </div>
    </header>
  );
}
