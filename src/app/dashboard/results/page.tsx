"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TraceDrawer } from "@/components/results/TraceDrawer";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ClassResultsMatrixPage() {
  const [activeClassId, setActiveClassId] = useState("c1010000-0000-0000-0000-000000000001");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/results?classId=${activeClassId}&grade=${encodeURIComponent(
          selectedGrade
        )}&search=${encodeURIComponent(searchQuery)}`
      );
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [activeClassId, selectedGrade, searchQuery]);

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      await fetch("/api/v1/engine/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: activeClassId }),
      });
      await loadData();
    } catch (err) {
      console.error("Calculation failed", err);
    } finally {
      setCalculating(false);
    }
  };

  const results = data?.results || [];
  const totalCount = results.length;
  const effectivePageSize = pageSize === -1 ? totalCount || 1 : pageSize;
  const totalPages = Math.ceil(totalCount / effectivePageSize) || 1;
  const startIndex = (currentPage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + effectivePageSize, totalCount);
  const paginatedResults = pageSize === -1 ? results : results.slice(startIndex, endIndex);

  return (
    <Shell>
      <Header
        title="Class Results Master Matrix"
        subtitle="Complete subject mark breakdown, component pass analysis, optional bonus, and deterministic GPA/grade"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 space-y-4 max-w-[1600px] mx-auto w-full">
        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px] max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student name, ID, roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Grade Filter:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                {(["ALL", "A+", "A", "A-", "B", "C", "D", "F"] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      selectedGrade === grade
                        ? "bg-white text-blue-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={-1}>All ({totalCount})</option>
            </select>
          </div>
        </div>

        {/* Master Results Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse select-none">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-bold sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-3 border-r border-slate-800 text-center w-12">Roll</th>
                  <th className="py-3 px-3 border-r border-slate-800 w-16">ID</th>
                  <th className="py-3 px-4 border-r border-slate-800 min-w-[160px]">Student Name</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-14">4th Opt</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-14">BAN</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-14">ENG</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-14">MAT</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-14">REL</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center min-w-[80px]">PHY (T+P)</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center min-w-[80px]">CHE (T+P)</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center min-w-[85px] bg-purple-950 text-purple-200">4th Opt (T+P)</th>
                  <th className="py-3 px-2 border-r border-slate-800 text-center w-16">Raw GPA</th>
                  <th className="py-3 px-3 border-r border-slate-800 text-center w-20">Final GPA</th>
                  <th className="py-3 px-3 border-r border-slate-800 text-center w-16">Grade</th>
                  <th className="py-3 px-3 text-center w-24">Audit Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-slate-400">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading class results matrix...
                    </td>
                  </tr>
                ) : paginatedResults.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-slate-500 font-sans">
                      No student results matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedResults.map((r: any) => {
                    const ban = r.subjectEvaluations?.find((s: any) => s.code === "BAN");
                    const eng = r.subjectEvaluations?.find((s: any) => s.code === "ENG");
                    const mat = r.subjectEvaluations?.find((s: any) => s.code === "MAT");
                    const rel = r.subjectEvaluations?.find((s: any) => s.code === "REL");
                    const phy = r.subjectEvaluations?.find((s: any) => s.code === "PHY");
                    const che = r.subjectEvaluations?.find((s: any) => s.code === "CHE");
                    const opt = r.subjectEvaluations?.find((s: any) => s.code === r.optionalSubject);

                    return (
                      <tr
                        key={r.studentId}
                        className={`hover:bg-blue-50/40 transition-colors ${
                          !r.isPassed ? "bg-red-50/20" : ""
                        }`}
                      >
                        {/* Roll */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-bold text-slate-700">
                          {r.roll || "—"}
                        </td>

                        {/* ID */}
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-900">
                          {r.studentId}
                        </td>

                        {/* Student Name */}
                        <td className="py-2.5 px-4 border-r border-slate-100 font-sans font-medium text-slate-900">
                          {r.studentName}
                        </td>

                        {/* Optional Code */}
                        <td className="py-2.5 px-2 border-r border-slate-100 text-center bg-purple-50/70">
                          <span className="bg-purple-100 text-purple-900 text-[10px] px-1.5 py-0.5 rounded font-bold border border-purple-300">
                            {r.optionalSubject}
                          </span>
                        </td>

                        {/* BAN */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(ban)}`}>
                          {ban?.displayMark}
                        </td>

                        {/* ENG */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(eng)}`}>
                          {eng?.displayMark}
                        </td>

                        {/* MAT */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(mat)}`}>
                          {mat?.displayMark}
                        </td>

                        {/* REL */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(rel)}`}>
                          {rel?.displayMark}
                        </td>

                        {/* PHY */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(phy)}`}>
                          {phy?.displayMark}
                        </td>

                        {/* CHE */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(che)}`}>
                          {che?.displayMark}
                        </td>

                        {/* 4th Opt (Optional Subject - Solid Purple Tint) */}
                        <td className={`py-2.5 px-2 border-r border-slate-100 text-center ${getCellBg(opt, true)}`}>
                          {opt?.displayMark}
                        </td>

                        {/* Raw GPA */}
                        <td className="py-2.5 px-2 border-r border-slate-100 text-center text-slate-500 text-[11px]">
                          {r.rawGPA.toFixed(2)}
                        </td>

                        {/* Final GPA */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-bold text-sm text-slate-900">
                          {r.finalGPA.toFixed(2)}
                        </td>

                        {/* Letter Grade */}
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          <GradeBadge grade={r.finalLetterGrade} size="sm" />
                        </td>

                        {/* Action: Trace */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedStudentId(r.studentId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors font-sans text-xs font-semibold border border-blue-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Trace</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalCount > 0 && (
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
              <div className="text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{totalCount === 0 ? 0 : startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900">{endIndex}</span> of{" "}
                <span className="font-bold text-slate-900">{totalCount}</span> students
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

        {/* Legend */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-900">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" />
            <span>Component Fail (Theory &lt; 25 / Practical &lt; 8)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" />
            <span>Optional 4th Subject (BIO / HMT / AGR)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300 inline-block" />
            <span>Absent Mark (AB)</span>
          </span>
        </div>
      </main>

      {/* Slideover Audit Trace Drawer */}
      <TraceDrawer
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </Shell>
  );
}

function getCellBg(sub: any, isOptional = false): string {
  if (!sub) return isOptional ? "bg-purple-50/70 font-semibold text-purple-900" : "";
  if (sub.isAbsent) return "bg-slate-200 text-slate-800 font-bold";
  if (!sub.isPassed) return "bg-red-100 text-red-800 font-bold";
  if (isOptional) return "bg-purple-50/80 font-semibold text-purple-950 border-l border-r border-purple-100";
  return "";
}
