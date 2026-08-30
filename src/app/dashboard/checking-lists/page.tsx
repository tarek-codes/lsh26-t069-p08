"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TraceDrawer } from "@/components/results/TraceDrawer";
import { SignoffModal } from "@/components/checking-lists/SignoffModal";
import {
  AlertTriangle,
  Eye,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

function CheckingListsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ALL";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [activeClassId, setActiveClassId] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [flags, setFlags] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [signoffFlag, setSignoffFlag] = useState<any | null>(null);

  const loadFlags = async () => {
    try {
      setLoading(true);
      let url = `/api/v1/checking-lists?listType=${activeTab}`;
      if (activeClassId) url += `&classId=${activeClassId}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setFlags(json.data);
        setSummary(json.summary);
      }
    } catch (err) {
      console.error("Failed to load checking lists", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadFlags();
  }, [activeTab, activeClassId, statusFilter]);

  // 3 Primary Criteria + All Filters (R-29)
  const tabs = [
    { id: "ALL", label: "All Flagged Students" },
    { id: "OPTIONAL_LOW", label: "Optional List (GP ≤ 2.0 / AB)" },
    { id: "PRACTICAL_FAIL", label: "Practical Fail List (< 8)" },
    { id: "ABSENT", label: "Absent List (AB)" },
  ];

  const totalCount = flags.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedFlags = flags.slice(startIndex, endIndex);

  return (
    <>
      <Header
        title="Checking List"
        subtitle="Rule R-29 Audit: Optional List (GP ≤ 2.0 or AB), Practical Fail List (Practical < 8), and Absent List (AB in any subject)"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Verification Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Flagged Cases</span>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              {summary?.totalFlagged ?? 0}
            </div>
            <p className="text-[11px] text-slate-400">Under 1 or more criteria</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-1">
            <span className="text-xs text-amber-800 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Verification</span>
            </span>
            <div className="text-2xl font-extrabold font-mono text-amber-900">
              {summary?.pending ?? 0}
            </div>
            <p className="text-[11px] text-amber-700">Requires teacher check</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-1">
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified &amp; Signed</span>
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-900">
              {summary?.verified ?? 0}
            </div>
            <p className="text-[11px] text-emerald-700">Audit confirmed</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs space-y-1">
            <span className="text-xs text-red-800 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Correction Needed</span>
            </span>
            <div className="text-2xl font-extrabold font-mono text-red-900">
              {summary?.correctionRequired ?? 0}
            </div>
            <p className="text-[11px] text-red-700">Pending score update</p>
          </div>
        </div>

        {/* 3 Criteria Filter Bar & Status Selector */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {/* 3 Criteria Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Criteria:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-white text-blue-700 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="CORRECTION_REQUIRED">Correction Required</option>
              </select>
            </div>
          </div>

          {/* Table of Checking List Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse select-none">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Criteria Category</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-4 min-w-[280px]">Trigger Reason &amp; Impact on Result</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Verified By / Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading checking list records...
                    </td>
                  </tr>
                ) : paginatedFlags.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                      No student records matched the selected criteria filter.
                    </td>
                  </tr>
                ) : (
                  paginatedFlags.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{f.studentName}</div>
                        <div className="font-mono text-[10px] text-slate-500">{f.studentCode}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">{f.className}</td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                            f.flagType === "PRACTICAL_FAIL"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : f.flagType === "ABSENT"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {f.flagType === "OPTIONAL_LOW"
                            ? "Optional Subject Rule"
                            : f.flagType === "PRACTICAL_FAIL"
                            ? "Practical Fail (<8)"
                            : "Absent Mark (AB)"}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {f.subjectCode}
                      </td>

                      <td className="py-3 px-4 text-slate-700 leading-relaxed font-sans">
                        {f.triggerReason}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={f.verificationStatus} />
                      </td>

                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {f.verifiedBy ? (
                          <div>
                            <span className="font-semibold text-slate-900">{f.verifiedBy}</span>
                            {f.notes && <p className="text-slate-500 italic mt-0.5">&ldquo;{f.notes}&rdquo;</p>}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not signed off</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedStudentId(f.studentId)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors inline-flex items-center gap-1 border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Trace</span>
                        </button>
                        <button
                          onClick={() => setSignoffFlag(f)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalCount > 0 && (
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
              <div className="text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900">{endIndex}</span> of{" "}
                <span className="font-bold text-slate-900">{totalCount}</span> flagged cases
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Centered Audit Trace Modal */}
      <TraceDrawer
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />

      {/* Verification Sign-Off Modal */}
      <SignoffModal
        flag={signoffFlag}
        onClose={() => setSignoffFlag(null)}
        onSuccess={loadFlags}
      />
    </>
  );
}

export default function CheckingListsPage() {
  return (
    <Shell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading checking list...
          </div>
        }
      >
        <CheckingListsContent />
      </Suspense>
    </Shell>
  );
}
