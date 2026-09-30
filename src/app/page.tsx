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
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const coreCapabilities = [
  {
    icon: Calculator,
    tag: "Arithmetic precision",
    title: "Deterministic Calculation Engine",
    desc: "Fixed-divisor decimal computation eliminating floating-point drift across all theory, MCQ, and practical aggregates.",
  },
  {
    icon: ClipboardList,
    tag: "Quality control",
    title: "Pre-Publication Checking Rosters",
    desc: "Three-tier verification for low elective performance, practical examination thresholds, and candidate absenteeism.",
  },
  {
    icon: UploadCloud,
    tag: "Data ingestion",
    title: "Schema & Rejection Diagnostics",
    desc: "Automated ingestion for CSV and JSON formats with specific error codes and instantaneous row-level diagnostics.",
  },
  {
    icon: BarChart3,
    tag: "Cohort metrics",
    title: "Cohort Failure Analytics",
    desc: "Comprehensive distribution breakdowns pinpointing the lowest-performing subjects across theory vs practical divisions.",
  },
  {
    icon: FileSpreadsheet,
    tag: "Real-time scoring",
    title: "Interactive Score Editor",
    desc: "Seamless marks entry with real-time recalculation of grade points, bonus adjustments, and status indicators.",
  },
  {
    icon: Printer,
    tag: "Compliance",
    title: "Official Academic Transcripts",
    desc: "Formal, single-page print-optimized academic grade sheets complete with step-by-step arithmetic breakdowns.",
  },
];

const logicPillars = [
  {
    title: "Dual-Component Verification",
    badge: "Rule integrity",
    desc: "Continuous validation ensuring Theory and Practical marks pass distinct minimum criteria independently before subject aggregation.",
  },
  {
    title: "Elective Subject Bonus",
    badge: "GPA optimization",
    desc: "Calculates additional credit from optional 4th subjects above baseline thresholds without inflating standard divisor limits.",
  },
  {
    title: "Compulsory Failure Locking",
    badge: "Academic standards",
    desc: "Immediate fail override if any core subject fails to meet passing criteria, preserving institutional evaluation standards.",
  },
  {
    title: "Formal Sign-off Workflow",
    badge: "Accountability",
    desc: "Mandatory pre-publication checklist approval preventing unreviewed grade sheets from reaching student distribution.",
  },
];

const heroStats = [
  { label: "Zero calculation errors", value: "100% Accuracy", hint: "Automated precision tabulation" },
  { label: "Institutional standard", value: "Fully Compliant", hint: "Built-in curriculum guidelines" },
  { label: "Publication safety", value: "Ready to Publish", hint: "Pre-publication risk filters" },
  { label: "Processing speed", value: "Instant Results", hint: "Real-time batch verification" },
];

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-semibold text-[var(--accent)]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--fg)]">{title}</h2>
      <p className="text-base leading-relaxed text-[var(--fg-muted)]">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] tracking-tight text-[var(--fg)]">
                  School<span className="text-[var(--accent)]">Engine</span>
                </span>
                <span className="px-1.5 py-px rounded-md text-[11px] font-medium bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-[var(--fg-subtle)] truncate">
                Deterministic GPA &amp; result processing
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle className="w-9 h-9 border border-[var(--border)] bg-[var(--surface)]" />
            <Link href="/login" className="btn btn-primary">
              <ShieldCheck />
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white dark:bg-[var(--surface)] border-b border-slate-200 dark:border-[var(--border)] min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center">
          {/* Animated ambient glowing orbs */}
          <div
            aria-hidden
            className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl animate-float pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute top-28 right-1/4 w-80 h-80 rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl animate-float-delayed pointer-events-none"
          />

          <div
            aria-hidden
            className="absolute inset-0 pattern-grid-light"
            style={{
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-80"
            style={{
              background:
                "radial-gradient(ellipse 50% 100% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-16 w-full flex-1 flex flex-col justify-center">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--fg-muted)] bg-[var(--surface)] border border-[var(--border)] shadow-xs transition-all hover:border-[var(--accent)] hover:shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                Secondary education examination &amp; tabulation suite
              </div>

              <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05] bg-linear-to-b from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent pb-1">
                School Result Processing
                <br />
                and GPA Engine
              </h1>
              <p className="mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-[var(--fg-muted)]">
                Accurate result processing, automated GPA calculations, and student grade reports built for schools.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/login"
                  className="btn btn-primary h-11 px-6 text-sm group shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Enter portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="#capabilities"
                  className="btn btn-secondary h-11 px-6 text-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>View Features</span>
                </Link>
              </div>
            </div>

            {/* Stat strip */}
            <div className="card mt-12 lg:mt-14 max-w-4xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 text-left overflow-hidden border border-slate-200/90 dark:border-[var(--border)] shadow-md shadow-slate-200/50 dark:shadow-none divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[var(--border)]">
              {heroStats.map((s, i) => (
                <div
                  key={s.label}
                  className="p-5 space-y-1 group transition-colors hover:bg-blue-50/50 dark:hover:bg-[var(--surface-alt)]"
                >
                  <p className="text-xs font-medium text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition-colors">
                    {s.label}
                  </p>
                  <p className="text-lg font-bold tracking-tight tabular-nums text-[var(--fg)] group-hover:scale-105 transition-transform origin-left">
                    {s.value}
                  </p>
                  <p className="text-xs text-[var(--fg-subtle)]">{s.hint}</p>
                </div>
              ))}
            </div>

            {/* Subtle scroll down indicator */}
            <div className="mt-8 flex justify-center">
              <a
                href="#curriculum"
                aria-label="Scroll to next section"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors group"
              >
                <span className="text-[11px] font-medium tracking-wide uppercase opacity-70">Scroll to explore</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[var(--accent)]" />
              </a>
            </div>
          </div>
        </section>

        {/* Illuminated Section Divider */}
        <div className="relative w-full overflow-hidden leading-none">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/35 dark:via-blue-400/20 to-transparent" />
        </div>

        {/* Evaluation logic pillars */}
        <section id="curriculum" className="scroll-mt-16 border-b border-slate-200 dark:border-[var(--border)] bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/70 dark:from-[var(--bg-subtle)] dark:via-[var(--surface-alt)] dark:to-[var(--bg-subtle)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
            <SectionHeading
              eyebrow="Institutional logic"
              title="Rigorous Curriculum Safeguards"
              desc="Built around standard curriculum guidelines to ensure compliant and transparent academic results."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {logicPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="card-interactive bg-white dark:bg-[var(--surface)] p-5.5 rounded-xl border border-slate-200/90 dark:border-[var(--border)] flex flex-col gap-3.5 shadow-xs hover:shadow-md hover:border-blue-400/60 dark:hover:border-blue-500/50 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xs">
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)] transition-transform group-hover:scale-105">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-[var(--fg)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Illuminated Section Divider */}
        <div className="relative w-full overflow-hidden leading-none">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/35 dark:via-blue-400/20 to-transparent" />
        </div>

        {/* Core capabilities */}
        <section id="capabilities" className="scroll-mt-16 bg-white dark:bg-[var(--bg)]">
          <div className="max-w-6xl mx-auto px-6 py-20 space-y-10">
            <SectionHeading
              eyebrow="Platform modules"
              title="All features"
              desc="Integrated tools for head examiners, teachers, and school administrators."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coreCapabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="card-interactive bg-white dark:bg-[var(--surface)] p-6 rounded-xl border border-slate-200/90 dark:border-[var(--border)] flex flex-col gap-4 shadow-xs hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/8 dark:hover:border-blue-500/60 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-[var(--accent-subtle)] dark:text-[var(--accent)] group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/25 transition-all duration-300">
                        <Icon className="w-5 h-5 transition-transform duration-300" />
                      </div>
                      <span className="text-xs font-medium text-[var(--fg-subtle)] whitespace-nowrap group-hover:text-[var(--accent)] transition-colors">
                        {item.tag}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-[15px] font-semibold tracking-tight text-[var(--fg)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 bg-white dark:bg-[var(--bg)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 border-2 border-blue-100 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 dark:from-[var(--surface)] dark:via-[var(--surface-alt)] dark:to-[var(--surface)] shadow-xl shadow-blue-500/5 group">
              {/* Floating ambient glow orbs */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl animate-float pointer-events-none"
              />
              <div
                aria-hidden
                className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-400/15 to-blue-500/15 blur-3xl animate-float-delayed pointer-events-none"
              />

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
                    <Cpu className="w-4 h-4 animate-pulse" />
                    <span>Ready for immediate deployment</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--fg)]">
                    Start tabulating results today
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    Sign into the examination controller portal with built-in demonstration fixtures and benchmark edge-cases.
                  </p>
                </div>
                <div className="relative shrink-0">
                  <Link
                    href="/login"
                    className="btn btn-primary h-12 px-6 text-sm group shadow-md shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span>Enter portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-200 dark:border-[var(--border)] bg-slate-100/90 dark:bg-[var(--surface)] text-[var(--fg-subtle)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>SchoolEngine evaluation platform &middot; Problem P08</span>
          </div>
          <div>National Secondary Education Examination Architecture</div>
        </div>
      </footer>
    </div>
  );
}
