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
  Clock,
  Flag,
  Inbox,
  Loader2,
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
  const pageSize = 5;

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
    { id: "ALL", label: "All flagged" },
    { id: "OPTIONAL_LOW", label: "Optional list (GP ≤ 2.0 / AB)" },
    { id: "PRACTICAL_FAIL", label: "Practical fail (< 8)" },
    { id: "ABSENT", label: "Absent (AB)" },
  ];

  const totalCount = flags.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedFlags = flags.slice(startIndex, endIndex);

  const stats = [
    {
      label: "Total Flagged Students",
      value: summary?.totalFlagged ?? 0,
      hint: "Under one or more criteria",
      icon: Flag,
      chip: "bg-slate-100 text-slate-600",
    },
    {
      label: "Pending verification",
      value: summary?.pending ?? 0,
      hint: "Requires teacher check",
      icon: Clock,
      chip: "bg-amber-50 text-amber-700",
    },
    {
      label: "Verified & signed",
      value: summary?.verified ?? 0,
      hint: "Review confirmed",
      icon: CheckCircle2,
      chip: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Correction needed",
      value: summary?.correctionRequired ?? 0,
      hint: "Pending score update",
      icon: AlertTriangle,
      chip: "bg-red-50 text-red-700",
    },
  ];

  return (
    <>
      <Header
        title="Checking list"
        subtitle="Students flagged before publication: optional subject GP ≤ 2.0 or absent, practical marks below 8, and absent in any subject"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
        showAllOption
      />

      <main className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Verification Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium text-[var(--fg-muted)]">{s.label}</span>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.chip}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <div className="-mt-1 text-2xl font-semibold tracking-tight tabular-nums text-[var(--fg)]">
                  {s.value}
                </div>
                <p className="mt-1 text-xs text-[var(--fg-subtle)]">{s.hint}</p>
              </div>
            );
          })}
        </div>

        {/* 3 Criteria Filter Bar & Status Selector */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
            {/* 3 Criteria Tabs */}
            <div role="tablist" aria-label="Criteria" className="segmented max-w-full overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <label className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--fg-muted)] whitespace-nowrap">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-48 pr-8"
              >
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending review</option>
                <option value="VERIFIED">Verified</option>
                <option value="CORRECTION_REQUIRED">Correction required</option>
              </select>
            </label>
          </div>

          {/* Table of Checking List Items */}
          <div className="overflow-x-auto">
            <table className="data-table select-none">
              <thead>
                <tr>
                  <th className="pl-5!">Student</th>
                  <th>Class</th>
                  <th>Criteria</th>
                  <th>Subject</th>
                  <th>Trigger reason &amp; impact on result</th>
                  <th>Status</th>
                  <th>Verified by / notes</th>
                  <th className="text-right! pr-5!">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16! text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--fg-subtle)]" />
                      <span className="text-sm text-[var(--fg-muted)]">Loading checking list records…</span>
                    </td>
                  </tr>
                ) : paginatedFlags.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16! text-center">
                      <Inbox className="w-6 h-6 mx-auto mb-2 text-[var(--fg-subtle)]" />
                      <span className="text-sm text-[var(--fg-muted)]">
                        No student records matched the selected criteria filter.
                      </span>
                    </td>
                  </tr>
                ) : (
                  paginatedFlags.map((f) => (
                    <tr key={f.id}>
                      <td className="pl-5! whitespace-nowrap">
                        <div className="font-medium text-[var(--fg)]">{f.studentName}</div>
                        <div className="font-mono text-[11px] text-[var(--fg-subtle)]">{f.studentCode}</div>
                      </td>

                      <td className="whitespace-nowrap text-[var(--fg-muted)]">{f.className}</td>

                      <td className="whitespace-nowrap">
                        <span
                          className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium ${
                            f.flagType === "PRACTICAL_FAIL"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : f.flagType === "ABSENT"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {f.flagType === "OPTIONAL_LOW"
                            ? "Optional subject rule"
                            : f.flagType === "PRACTICAL_FAIL"
                            ? "Practical fail (< 8)"
                            : "Absent mark (AB)"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap font-mono text-xs font-medium text-[var(--fg)]">
                        {f.subjectCode}
                      </td>

                      <td className="min-w-[260px] leading-relaxed text-[var(--fg-muted)]">
                        {f.triggerReason}
                      </td>

                      <td className="whitespace-nowrap">
                        <StatusBadge status={f.verificationStatus} />
                      </td>

                      <td className="text-xs">
                        {f.verifiedBy ? (
                          <div className="max-w-[220px]">
                            <span className="font-medium text-[var(--fg)] whitespace-nowrap">{f.verifiedBy}</span>
                            {f.notes && (
                              <p className="mt-0.5 text-[var(--fg-muted)] line-clamp-2" title={f.notes}>
                                &ldquo;{f.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--fg-subtle)]" title="Not signed off">
                            —<span className="sr-only">Not signed off</span>
                          </span>
                        )}
                      </td>

                      <td className="pr-5! whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudentId(f.studentId)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Eye />
                            <span>Trace</span>
                          </button>
                          <button onClick={() => setSignoffFlag(f)} className="btn btn-primary btn-sm">
                            <ShieldCheck />
                            <span>Verify</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalCount > 0 && (
            <div className="bg-[var(--surface-alt)] px-5 py-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 select-none">
              <div className="text-xs text-[var(--fg-muted)] tabular-nums">
                Showing <span className="font-medium text-[var(--fg)]">{startIndex + 1}</span>–
                <span className="font-medium text-[var(--fg)]">{endIndex}</span> of{" "}
                <span className="font-medium text-[var(--fg)]">{totalCount}</span> flagged cases
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                      className={`btn btn-sm w-[30px] px-0! tabular-nums ${
                        currentPage === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Next</span>
                  <ChevronRight />
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
          <div className="p-12 text-center text-sm text-[var(--fg-muted)]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--fg-subtle)]" />
            Loading checking list…
          </div>
        }
      >
        <CheckingListsContent />
      </Suspense>
    </Shell>
  );
}
