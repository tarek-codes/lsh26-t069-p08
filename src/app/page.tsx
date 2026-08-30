"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Calculator,
  ClipboardList,
  UploadCloud,
  Printer,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const features = [
  {
    icon: Calculator,
    title: "Deterministic GPA Engine",
    desc: "Calculates grade points and letter grades using arbitrary-precision arithmetic — no floating-point rounding errors, ever.",
  },
  {
    icon: ClipboardList,
    title: "Pre-Publication Checking",
    desc: "Automated rosters for low elective scores, practical failures, and absent candidates — with audit sign-off before results go live.",
  },
  {
    icon: UploadCloud,
    title: "Marks Ingestion",
    desc: "Upload CSV, TSV, or JSON marks sheets. Invalid rows are flagged with exact diagnostic reasons and suggested fixes.",
  },
  {
    icon: BarChart3,
    title: "Failure Analytics",
    desc: "Cohort pass rates, grade distribution charts, and identification of the worst-performing subject with component breakdown.",
  },
  {
    icon: FileSpreadsheet,
    title: "Live Score Editor",
    desc: "Full-width table editor with student selection and real-time GPA recalculation on every keystroke.",
  },
  {
    icon: Printer,
    title: "Transcripts & Audit Trail",
    desc: "Printable official academic transcripts with the full arithmetic calculation breakdown for every student.",
  },
];

const pillars = [
  {
    label: "Dual-Component Validation",
    desc: "Theory and Practical marks evaluated independently for science electives.",
  },
  {
    label: "Elective Bonus Points",
    desc: "Fourth subject excess grade points added without affecting the compulsory divisor.",
  },
  {
    label: "Compulsory Subject Lock",
    desc: "Any core subject failure sets final GPA to zero and logs a full audit trace.",
  },
  {
    label: "Three-Tier Review",
    desc: "Low elective, practical fail, and absent rosters must be signed off before publication.",
  },
];

export default function LandingPage() {
  return (
    <div
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      className="min-h-screen flex flex-col font-sans antialiased"
    >
      {/* ─── HEADER ─── */}
      <header
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:bg-[var(--accent-hover)] transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight leading-none" style={{ color: "var(--fg)" }}>
                School<span style={{ color: "var(--accent)" }}>Engine</span>
              </p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--fg-subtle)" }}>
                Secondary Result &amp; GPA System
              </p>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-fg)",
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-[var(--accent-hover)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
        className="px-6 pt-20 pb-24"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div
            style={{
              backgroundColor: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
            National Secondary Education Curriculum Engine
          </div>

          <h1
            style={{ color: "var(--fg)" }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]"
          >
            School Result Processing
            <br />
            and GPA Engine
          </h1>

          <p
            style={{ color: "var(--fg-muted)" }}
            className="text-base max-w-xl mx-auto leading-relaxed"
          >
            Automated examination result tabulation, dual-component practical
            validation, and three-tier pre-publication verification for
            secondary schools.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors hover:bg-[var(--accent-hover)]"
            >
              Enter Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PILLARS ─── */}
      <section
        style={{
          backgroundColor: "var(--bg-subtle)",
          borderBottom: "1px solid var(--border)",
        }}
        className="px-6 py-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div
              key={p.label}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              className="rounded-xl p-5 space-y-2"
            >
              <p className="text-xs font-bold" style={{ color: "var(--accent)" }}>
                {p.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-6 py-16 flex-1">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
              Administrative &amp; Examination Capabilities
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
              End-to-end workflows from raw marks ingestion to printable transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                  className="rounded-xl p-6 space-y-3 hover:border-[var(--border-strong)] transition-colors"
                >
                  <div
                    style={{
                      backgroundColor: "var(--accent-subtle)",
                      border: "1px solid var(--accent-border)",
                    }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="font-bold text-sm" style={{ color: "var(--fg)" }}>
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
        className="px-6 py-14"
      >
        <div
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          className="max-w-3xl mx-auto rounded-2xl p-10 text-center space-y-4"
        >
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
            Ready to tabulate class results?
          </h2>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Access the portal with pre-configured demo credentials — no setup required.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors hover:bg-[var(--accent-hover)]"
            >
              Enter Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-subtle)",
          color: "var(--fg-subtle)",
        }}
        className="px-6 py-5 text-xs font-mono"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>SchoolEngine &bull; GPA Engine (Problem P08)</span>
          <span>National Curriculum Grading Architecture</span>
        </div>
      </footer>
    </div>
  );
}
