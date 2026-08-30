"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import {
  Printer,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
} from "lucide-react";

export default function ReportsPage() {
  const [activeClassId, setActiveClassId] = useState("c1010000-0000-0000-0000-000000000001");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // View Mode: "ALL" (Whole Class) | "SINGLE" (Individual Student)
  const [viewMode, setViewMode] = useState<"ALL" | "SINGLE">("ALL");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Pagination for "ALL" mode on screen
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // State to trigger whole-class print rendering of all students
  const [isPrintingAll, setIsPrintingAll] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/export/report-cards?classId=${activeClassId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          if (json.data.transcripts && json.data.transcripts.length > 0) {
            setSelectedStudentId(json.data.transcripts[0].student.id);
          }
        }
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }
    setCurrentPage(1);
    loadReports();
  }, [activeClassId]);

  const handlePrintWholeClass = () => {
    setIsPrintingAll(true);
    setViewMode("ALL");
    // Allow DOM to re-render with all transcripts present before invoking print dialog
    setTimeout(() => {
      window.print();
      setIsPrintingAll(false);
    }, 250);
  };

  const handlePrintSingleStudent = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setIsPrintingAll(false);
    setViewMode("SINGLE");
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const transcripts = data?.transcripts || [];
  const totalCount = transcripts.length;

  // Single student item
  const singleStudentTranscript = transcripts.find(
    (t: any) => t.student.id === selectedStudentId
  ) || transcripts[0];

  const currentStudentIndex = transcripts.findIndex(
    (t: any) => t.student.id === (singleStudentTranscript?.student?.id || "")
  );

  // Pagination calculations for ALL mode on screen
  const effectivePageSize = isPrintingAll || pageSize === -1 ? totalCount || 1 : pageSize;
  const totalPages = Math.ceil(totalCount / effectivePageSize) || 1;
  const startIndex = (currentPage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + effectivePageSize, totalCount);
  const paginatedTranscripts = isPrintingAll || pageSize === -1 ? transcripts : transcripts.slice(startIndex, endIndex);

  return (
    <Shell>
      <Header
        title="Transcripts"
        subtitle="Print individual student academic transcripts or batch-print the entire class cohort (1 student per page)"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      {/* Action Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print px-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => {
                setIsPrintingAll(false);
                setViewMode("ALL");
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "ALL"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Whole Class ({totalCount})</span>
            </button>
            <button
              onClick={() => {
                setIsPrintingAll(false);
                setViewMode("SINGLE");
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === "SINGLE"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Single Student</span>
            </button>
          </div>

          {/* Single Student Selector Dropdown */}
          {viewMode === "SINGLE" && (
            <div className="flex items-center gap-2">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {transcripts.map((t: any) => (
                  <option key={t.student.id} value={t.student.id}>
                    Roll {t.student.roll}: {t.student.name} ({t.student.id}) — GPA {t.result.finalGPA.toFixed(2)} ({t.result.finalLetterGrade})
                  </option>
                ))}
              </select>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (currentStudentIndex > 0) {
                      setSelectedStudentId(transcripts[currentStudentIndex - 1].student.id);
                    }
                  }}
                  disabled={currentStudentIndex <= 0}
                  title="Previous Student"
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (currentStudentIndex < totalCount - 1) {
                      setSelectedStudentId(transcripts[currentStudentIndex + 1].student.id);
                    }
                  }}
                  disabled={currentStudentIndex >= totalCount - 1}
                  title="Next Student"
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Page size for ALL mode */}
          {viewMode === "ALL" && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>View:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={-1}>All ({totalCount})</option>
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {viewMode === "ALL" ? (
            <button
              onClick={handlePrintWholeClass}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Whole Class ({totalCount} Transcripts)</span>
            </button>
          ) : (
            <button
              onClick={() => handlePrintSingleStudent()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print This Student Transcript</span>
            </button>
          )}
        </div>
      </div>

      {/* Pagination Bar for ALL mode */}
      {viewMode === "ALL" && totalPages > 1 && !isPrintingAll && (
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 no-print">
          <div>
            Showing <span className="font-bold text-slate-900">{startIndex + 1}–{endIndex}</span> of{" "}
            <span className="font-bold text-slate-900">{totalCount}</span> students
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono font-bold px-2 text-slate-800">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Content */}
      <main className="p-6 space-y-8 max-w-5xl mx-auto w-full print:p-0 print:space-y-0 print:max-w-none">
        {loading ? (
          <div className="py-24 text-center text-slate-400 no-print">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Generating official transcripts...
          </div>
        ) : viewMode === "SINGLE" ? (
          /* Single Student Transcript View */
          singleStudentTranscript ? (
            <TranscriptCard
              item={singleStudentTranscript}
              onPrintSingle={() => handlePrintSingleStudent()}
              isSingleMode
            />
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              No transcript found for selected student.
            </div>
          )
        ) : (
          /* Whole Class Transcripts View */
          paginatedTranscripts.map((item: any) => (
            <TranscriptCard
              key={item.student.id}
              item={item}
              onPrintSingle={() => handlePrintSingleStudent(item.student.id)}
            />
          ))
        )}
      </main>
    </Shell>
  );
}

function TranscriptCard({
  item,
  onPrintSingle,
  isSingleMode = false,
}: {
  item: any;
  onPrintSingle: () => void;
  isSingleMode?: boolean;
}) {
  const student = item.student;
  const res = item.result;

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs print:shadow-none print:border-slate-400 print:rounded-none page-break space-y-6">
      {/* Action header inside card for easy 1-click print */}
      {!isSingleMode && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
          <span className="text-xs font-mono font-bold text-slate-500">
            Roll {student.roll} • {student.id}
          </span>
          <button
            onClick={onPrintSingle}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-md border border-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Only This Student</span>
          </button>
        </div>
      )}

      {/* Official Transcript Header */}
      <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
        <div className="flex items-center justify-center gap-2 text-blue-900 font-bold text-lg">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <span>SCHOOL RESULT PROCESSING &amp; GPA ENGINE</span>
        </div>
        <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
          Official Academic Transcript • Academic Year 2026
        </p>
      </div>

      {/* Student Bio */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs font-mono">
        <div>
          <span className="text-slate-500 block text-[10px]">Student Name:</span>
          <span className="font-bold text-slate-900 font-sans">{student.name}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Student ID / Roll:</span>
          <span className="font-bold text-slate-900">{student.id} (Roll {student.roll})</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Class Cohort:</span>
          <span className="font-bold text-slate-900">{student.class}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Optional 4th Subject:</span>
          <span className="font-bold text-purple-700">{student.optionalSubject}</span>
        </div>
      </div>

      {/* Grades Table */}
      <table className="w-full text-xs text-left border border-slate-300 border-collapse">
        <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-300 font-mono">
          <tr>
            <th className="p-2 border-r border-slate-300 w-12 text-center">No</th>
            <th className="p-2 border-r border-slate-300">Subject Name</th>
            <th className="p-2 border-r border-slate-300 w-24 text-center">Type</th>
            <th className="p-2 border-r border-slate-300 w-28 text-center">Marks (T+P)</th>
            <th className="p-2 border-r border-slate-300 w-20 text-center">Total</th>
            <th className="p-2 border-r border-slate-300 w-20 text-center">GP</th>
            <th className="p-2 w-16 text-center">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-mono">
          {res?.subjectEvaluations?.map((sub: any, sIdx: number) => {
            const isOptional = !sub.isCompulsory;
            return (
              <tr
                key={sub.code}
                className={`${!sub.isPassed ? "bg-red-50/40" : isOptional ? "bg-purple-50/80 font-medium" : ""}`}
              >
                <td className="p-2 border-r border-slate-200 text-center text-slate-500">{sIdx + 1}</td>
                <td className="p-2 border-r border-slate-200 font-sans font-medium text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className={isOptional ? "font-bold text-purple-950" : ""}>{sub.name} ({sub.code})</span>
                    {isOptional && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 border border-purple-300 font-mono no-print">
                        Optional 4th
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2 border-r border-slate-200 text-center text-[11px]">
                  <span className={isOptional ? "font-bold text-purple-900" : "text-slate-600"}>
                    {sub.isCompulsory ? "Compulsory" : "4th Optional"}
                  </span>
                </td>
                <td className={`p-2 border-r border-slate-200 text-center ${isOptional ? "font-bold text-purple-950 bg-purple-100/50" : "text-slate-700"}`}>
                  {sub.displayMark}
                </td>
                <td className="p-2 border-r border-slate-200 text-center font-bold">
                  {sub.totalMark}
                </td>
                <td className="p-2 border-r border-slate-200 text-center font-bold">
                  {sub.gradePoint.toFixed(2)}
                </td>
                <td className="p-2 text-center">
                  <GradeBadge grade={sub.letterGrade} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Calculation Summary Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 text-white p-4 rounded-xl font-mono text-xs">
        <div className="space-y-1">
          <p className="text-slate-400">Sum of 6 Compulsory GPs: <span className="text-white font-bold">{res?.compulsoryGPsSum.toFixed(2)} / 30.00</span></p>
          <p className="text-slate-400">Optional 4th Subject Bonus: <span className="text-purple-400 font-bold">+{res?.optionalBonusGP.toFixed(2)} GP</span></p>
          <p className="text-slate-400">Raw Calculated GPA: <span className="text-slate-200">{res?.rawGPA.toFixed(2)}</span></p>
        </div>

        <div className="sm:text-right space-y-1 flex sm:flex-col justify-between sm:justify-center">
          <div className="text-sm text-slate-300">Final Assessment Result:</div>
          <div className="flex items-center sm:justify-end gap-3">
            <span className="text-2xl font-extrabold text-white">
              GPA {res?.finalGPA.toFixed(2)}
            </span>
            <GradeBadge grade={res?.finalLetterGrade} size="lg" />
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
        <div className="border-t border-slate-400 pt-1 font-medium">
          Class Teacher
        </div>
        <div className="border-t border-slate-400 pt-1 font-medium">
          Examination Controller
        </div>
        <div className="border-t border-slate-400 pt-1 font-medium">
          Headmaster / Seal
        </div>
      </div>
    </div>
  );
}
