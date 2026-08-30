"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Calculator,
  ClipboardList,
  UploadCloud,
  Printer,
  FileSpreadsheet,
  BarChart3,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-800 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center">
                School<span className="text-blue-500">Engine</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono leading-none">
                Secondary Result &amp; GPA System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-20 pb-20 px-6 border-b border-slate-800 bg-slate-950">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>National Secondary Education Curriculum Engine</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                School Result Processing and GPA Engine
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Automated examination result tabulation, dual-component practical validation, and three-tier pre-publication verification for secondary schools.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Academic Principles Strip */}
        <section className="py-12 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Dual-Component Pass
                </div>
                <div className="font-bold text-sm text-white">Independent Practical Checks</div>
                <p className="text-xs text-slate-400">
                  Theory (&ge; 25/75) and Practical (&ge; 8/25) evaluated independently for science electives.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Elective Bonus
                </div>
                <div className="font-bold text-sm text-white">4th Subject Calculation</div>
                <p className="text-xs text-slate-400">
                  Adds excess grade points over 2.0 without altering the compulsory divisor.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Academic Integrity
                </div>
                <div className="font-bold text-sm text-white">Compulsory Subject Protection</div>
                <p className="text-xs text-slate-400">
                  A failing score in any core subject prevents unearned promotions and logs full audit traces.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Audit Verification
                </div>
                <div className="font-bold text-sm text-white">Pre-Publication Checking Lists</div>
                <p className="text-xs text-slate-400">
                  Automated rosters for low elective scores, practical failures, and absent candidates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Modules Grid */}
        <section id="features" className="py-16 px-6 max-w-7xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Administrative &amp; Examination Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              End-to-end verification workflows from raw marks ingestion to printable transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Deterministic GPA Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates grade points and letter grades using arbitrary-precision arithmetic without floating-point rounding errors.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Pre-Publication Checking Lists</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated filtering for edge-case review: Low Elective Scores, Practical Failures, and Absent candidates with audit sign-off.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Marks Ingestion &amp; Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload or paste CSV, TSV, or JSON marks sheets. Reports invalid rows with exact diagnostic reasons and suggested fixes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Class Summary &amp; Failure Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cohort pass rates, grade distribution charts, and identification of the worst-performing subject with component breakdown.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Live Real-Time Score Editor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single full-width table editor with integrated student selection and immediate calculation updates.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Transcripts &amp; Calculation Audit Trace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official printable academic transcripts with full arithmetic calculation breakdown steps for every enrolled student.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-6 border-t border-slate-800 bg-slate-950">
          <div className="max-w-4xl mx-auto p-8 rounded-xl bg-slate-900 border border-slate-800 text-white text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to Tabulate Class Examination Results?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Access the administrative portal with pre-configured demo credentials.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>SchoolEngine • Deterministic GPA Engine (Problem P08)</div>
          <div>National Curriculum Grading Architecture</div>
        </div>
      </footer>
    </div>
  );
}
