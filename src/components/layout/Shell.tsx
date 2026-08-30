"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

interface ShellProps {
  children: React.ReactNode;
  noScroll?: boolean;
}

export function Shell({ children, noScroll = false }: ShellProps) {
  return (
    <div
      className="flex h-screen max-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen max-h-screen ${
          noScroll ? "overflow-hidden" : "overflow-y-auto"
        }`}
        style={{ backgroundColor: "var(--bg)" }}
      >
        {children}
      </div>
    </div>
  );
}
