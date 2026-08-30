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
  Sparkles,
  FileSpreadsheet,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center">
                School<span className="text-blue-400">Engine</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Secondary Result &amp; GPA System</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Core Capabilities
            </a>
            <a href="#rules" className="hover:text-white transition-colors">
              Grading Rules
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Audit Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 group"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Compliant with Rules R-10 through R-30 • Problem P08</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              School Result Processing and GPA Engine
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Engineered to permanently eliminate spreadsheet errors in secondary school exam tabulation with arbitrary-precision calculation, explainable per-student audit traces, and three-tier pre-publication verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enter Admin Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto w-full z-10 space-y-12">
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
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Dual-Component Grading Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces Theory (&ge; 25/75) and Practical (&ge; 8/25) pass thresholds independently. Automatically calculates max(0, GP - 2.0) optional 4th subject bonus points.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Rule R-29 Checking Lists</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated pre-publication verification grouping students into Optional (&le; 2.0), Practical Fail (&lt; 8), and Absentee lists with official sign-off audit trails.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Marks Ingestion &amp; Rejection Reporter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload CSV, TSV, or JSON marks sheets. Flags rejected rows with exact rule violation codes and suggested fixes before one-click committing valid data.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Subject Failure Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Class-wide failure analytics identifying the single worst-performing subject, root causes (Theory vs Practical vs Absent), and grade distributions.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Live Real-Time Score Editor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast full-width editor with embedded student dropdown and keyboard-friendly stepper. Real-time GP recalculation and glowing optional subject highlighting.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
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
      <section className="py-12 px-6 max-w-5xl mx-auto w-full z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/60 border border-blue-500/30 backdrop-blur-xl text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Process Secondary School Examination Results?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Experience the automated, zero-drift calculation engine with live audit trails.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Admin Sign In</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="px-6 py-6 border-t border-slate-900 bg-slate-950/90 text-slate-500 text-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>SchoolEngine • Deterministic GPA Engine (Problem P08)</div>
          <div>All National Secondary Grading Rules Implemented</div>
        </div>
      </footer>
    </div>
  );
}
