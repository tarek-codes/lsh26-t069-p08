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
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const coreCapabilities = [
  {
    icon: Calculator,
    tag: "Arithmetic Precision",
    title: "Deterministic Calculation Engine",
    desc: "Fixed-divisor decimal computation eliminating floating-point drift across all theory, MCQ, and practical aggregates.",
  },
  {
    icon: ClipboardList,
    tag: "Audit Control",
    title: "Pre-Publication Checking Rosters",
    desc: "Three-tier verification for low elective performance, practical examination thresholds, and candidate absenteeism.",
  },
  {
    icon: UploadCloud,
    tag: "Data Ingestion",
    title: "Schema & Rejection Diagnostics",
    desc: "Automated ingestion for CSV, TSV, and JSON formats with specific error codes and instantaneous row-level diagnostics.",
  },
  {
    icon: BarChart3,
    tag: "Cohort Metrics",
    title: "Cohort Failure Analytics",
    desc: "Comprehensive distribution breakdowns pinpointing the lowest-performing subjects across theory vs practical divisions.",
  },
  {
    icon: FileSpreadsheet,
    tag: "Real-Time Scoring",
    title: "Interactive Score Editor",
    desc: "Seamless marks entry with real-time recalculation of grade points, bonus adjustments, and status indicators.",
  },
  {
    icon: Printer,
    tag: "Compliance",
    title: "Official Academic Transcripts",
    desc: "Formal, single-page print-optimized academic grade sheets complete with step-by-step arithmetic audit traces.",
  },
];

const logicPillars = [
  {
    title: "Dual-Component Verification",
    badge: "Rule Integrity",
    desc: "Continuous validation ensuring Theory and Practical marks pass distinct minimum criteria independently before subject aggregation.",
  },
  {
    title: "Elective Subject Bonus",
    badge: "GPA Optimization",
    desc: "Calculates additional credit from optional 4th subjects above baseline thresholds without inflating standard divisor limits.",
  },
  {
    title: "Compulsory Failure Locking",
    badge: "Academic Standards",
    desc: "Immediate fail override if any core subject fails to meet passing criteria, preserving institutional evaluation standards.",
  },
  {
    title: "Formal Sign-off Workflow",
    badge: "Accountability",
    desc: "Mandatory pre-publication checklist approval preventing unreviewed grade sheets from reaching student distribution.",
  },
];

export default function LandingPage() {
  return (
    <div
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      className="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white"
    >
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
        className="sticky top-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight" style={{ color: "var(--fg)" }}>
                  School<span style={{ color: "var(--accent)" }}>Engine</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: "var(--fg-subtle)" }}>
                Deterministic GPA &amp; Result Processing
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-fg)",
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-95 active:scale-98 transition-all shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 opacity-90" />
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
          className="relative px-6 pt-24 pb-28 pattern-grid-light overflow-hidden"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            {/* Top Chip */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border)] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span style={{ color: "var(--fg-muted)" }}>Secondary Education Examination &amp; Tabulation Suite</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1
                style={{ color: "var(--accent)" }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]"
              >
                School Result Processing
                <br />
                and GPA Engine
              </h1>
              <p
                style={{ color: "var(--fg-muted)" }}
                className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal"
              >
                Zero-drift deterministic calculations, strict dual-component threshold evaluation, and verifiable pre-publication audit workflows designed for academic institutions.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/login"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold shadow-md hover:scale-102 active:scale-98 transition-all"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#capabilities"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--fg)",
                  borderColor: "var(--border-strong)",
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border hover:bg-[var(--bg-subtle)] transition-all"
              >
                <span>View Architecture</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border)",
              }}
              className="mt-12 p-5 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-4 text-left shadow-xs"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-subtle)" }}>
                  Zero Calculation Errors
                </p>
                <p className="text-xl font-extrabold font-mono" style={{ color: "var(--fg)" }}>
                  100% Accuracy
                </p>
                <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>Automated Precision Tabulation</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-subtle)" }}>
                  Institutional Standard
                </p>
                <p className="text-xl font-extrabold font-mono" style={{ color: "var(--fg)" }}>
                  Fully Compliant
                </p>
                <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>Built-in Curriculum Guidelines</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-subtle)" }}>
                  Publication Safety
                </p>
                <p className="text-xl font-extrabold font-mono" style={{ color: "var(--fg)" }}>
                  Audit Ready
                </p>
                <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>Pre-Publication Risk Filters</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-subtle)" }}>
                  Processing Speed
                </p>
                <p className="text-xl font-extrabold font-mono" style={{ color: "var(--fg)" }}>
                  Instant Results
                </p>
                <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>Real-Time Batch Verification</p>
              </div>
            </div>
          </div>
        </section>

        {/* Evaluation Logic Pillars */}
        <section
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border)",
          }}
          className="py-16 px-6"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                  Institutional Logic
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ color: "var(--fg)" }}>
                  Rigorous Curriculum Safeguards
                </h2>
              </div>
              <p className="text-xs sm:text-sm max-w-md" style={{ color: "var(--fg-muted)" }}>
                Built around standard curriculum guidelines to ensure compliant and transparent academic results.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {logicPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                  className="p-6 rounded-2xl border space-y-3.5 hover:border-[var(--border-strong)] hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                      {pillar.badge}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-base" style={{ color: "var(--fg)" }}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Administrative Capabilities */}
        <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              Platform Modules
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--fg)" }}>
              All features
            </h2>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
              Integrated tools for head examiners, teachers, and school administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                  className="p-7 rounded-2xl border space-y-4 hover:border-[var(--accent)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      style={{
                        backgroundColor: "var(--accent-subtle)",
                        borderColor: "var(--accent-border)",
                      }}
                      className="w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform"
                    >
                      <Icon className="w-6 h-6" style={{ color: "var(--accent)" }} />
                    </div>
                    <span className="text-[11px] font-mono font-medium" style={{ color: "var(--fg-subtle)" }}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--fg)" }}>
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Callout */}
        <section
          style={{
            backgroundColor: "var(--surface)",
            borderTop: "1px solid var(--border)",
          }}
          className="py-16 px-6"
        >
          <div
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-strong)",
            }}
            className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-12 border text-center space-y-6 shadow-sm"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Ready for Immediate Deployment</span>
            </div>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--fg)" }}>
                Start Tabulating Results Today
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: "var(--fg-muted)" }}>
                Sign into the examination controller portal with built-in demonstration fixtures and benchmark edge-cases.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold shadow-md hover:scale-102 active:scale-98 transition-all"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "var(--bg)",
          borderTop: "1px solid var(--border)",
          color: "var(--fg-subtle)",
        }}
        className="px-6 py-6 text-xs font-mono"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SchoolEngine Evaluation Platform &bull; Problem P08</span>
          </div>
          <div>National Secondary Education Examination Architecture</div>
        </div>
      </footer>
    </div>
  );
}
