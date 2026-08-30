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
  HelpCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-blue-600 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center">
                School<span className="text-blue-600">Engine</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono leading-none">
                Secondary Result &amp; GPA System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              <span>Admin Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-16 pb-16 px-6 border-b border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Standard Curriculum Compliance • Problem P08</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                School Result Processing and GPA Engine
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Deterministic examination result tabulation, dual-component practical validation, and three-tier pre-publication verification for secondary schools.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 cursor-pointer"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Rule Principles & Architectural Integrity */}
        <section className="py-12 px-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold font-mono text-blue-600 uppercase tracking-wider">
                  Rule R-11
                </div>
                <div className="font-bold text-sm text-slate-900">Dual-Component Pass</div>
                <p className="text-xs text-slate-500">
                  Theory (&ge;25/75) and Practical (&ge;8/25) verified independently.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold font-mono text-blue-600 uppercase tracking-wider">
                  Rule R-20
                </div>
                <div className="font-bold text-sm text-slate-900">4th Subject Bonus</div>
                <p className="text-xs text-slate-500">
                  Adds max(0, GP - 2.0) bonus points over strict 6.0 divisor.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold font-mono text-blue-600 uppercase tracking-wider">
                  Rule R-13
                </div>
                <div className="font-bold text-sm text-slate-900">Compulsory Failure Override</div>
                <p className="text-xs text-slate-500">
                  Any compulsory fail forces final GPA to 0.00 (F) with audit log.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold font-mono text-blue-600 uppercase tracking-wider">
                  Rule R-29
                </div>
                <div className="font-bold text-sm text-slate-900">Checking Lists</div>
                <p className="text-xs text-slate-500">
                  Optional Low, Practical Fail, and Absentee verification lists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Modules Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Administrative &amp; Examination Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              End-to-end verification workflows from data ingestion to signed transcripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Deterministic GPA Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates grade points and letter grades using arbitrary-precision arithmetic without floating-point rounding drift.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Pre-Publication Checking Lists</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated filtering for edge-case review: Optional Low (GP &le; 2.0), Practical Fail (&lt; 8), and Absent lists with audit sign-off.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Marks Ingestion &amp; Rejection Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload or paste CSV, TSV, or JSON marks sheets. Reports invalid rows with exact rule violation codes and suggested fixes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Class Summary &amp; Failure Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cohort pass rates, grade distribution charts, and identification of the worst-performing subject with component failure breakdown.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Live Real-Time Score Editor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single full-width table editor with integrated student selection and immediate calculation updates.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Transcripts &amp; Calculation Audit Trace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Official printable academic transcripts with full arithmetic calculation breakdown steps for every enrolled student.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="py-12 px-6 border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto p-8 rounded-xl bg-slate-900 text-white text-center space-y-4">
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
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-slate-200 bg-slate-100 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>SchoolEngine • Deterministic GPA Engine (Problem P08)</div>
          <div>National Curriculum Grading Rules R-10 to R-30</div>
        </div>
      </footer>
    </div>
  );
}
