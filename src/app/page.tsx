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
  Flame,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center">
                School<span className="text-blue-500">Engine</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Secondary Result &amp; GPA System</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span>Compliant with Rules R-10 through R-30 • Problem P08</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            School Result Processing and GPA Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Engineered to permanently eliminate spreadsheet errors in secondary school exam tabulation with arbitrary-precision calculation, explainable per-student audit traces, and three-tier pre-publication verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Admin Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Complete Suite for Examination Controllers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From raw marks ingestion to printable academic transcripts with full explainability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Dual-Component Grading Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces Theory (&ge; 25/75) and Practical (&ge; 8/25) pass thresholds independently. Automatically calculates max(0, GP - 2.0) optional 4th subject bonus points.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Rule R-29 Checking Lists</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated pre-publication verification grouping students into Optional (&le; 2.0), Practical Fail (&lt; 8), and Absentee lists with official sign-off audit trails.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Marks Ingestion &amp; Rejection Reporter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload CSV, TSV, or JSON marks sheets. Flags rejected rows with exact rule violation codes and suggested fixes before one-click committing valid data.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950 border border-red-800/40 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Subject Failure Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Class-wide failure analytics identifying the single worst-performing subject, root causes (Theory vs Practical vs Absent), and grade distributions.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Live Real-Time Score Editor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast full-width editor with embedded student dropdown and keyboard-friendly stepper. Real-time GP recalculation and optional subject highlighting.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Official Transcripts &amp; Audit Trace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Print-ready academic report cards featuring step-by-step arithmetic explanations, component marks, and fail overrides.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to Process Secondary School Examination Results?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Experience the automated, zero-drift calculation engine with live audit trails.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="px-6 py-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>SchoolEngine • Deterministic GPA Engine (Problem P08)</div>
          <div>All National Secondary Grading Rules Implemented</div>
        </div>
      </footer>
    </div>
  );
}
