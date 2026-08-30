"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import {
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { RawMark } from "@/engine/types";
import { calculateStudentGPA } from "@/engine/calculator";
import { evaluateSubjectMark } from "@/engine/rules";

export default function MarksEntryPage() {
  const [activeClassId, setActiveClassId] = useState("c1010000-0000-0000-0000-000000000001");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("S001");
  const [currentMarks, setCurrentMarks] = useState<Record<string, RawMark>>({});
  const [savedStatus, setSavedStatus] = useState<string>("Synced");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load students for active class
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch(`/api/v1/students?classId=${activeClassId}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setStudents(json.data);
          setSelectedStudentId(json.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load students", err);
      }
    }
    loadStudents();
  }, [activeClassId]);

  // Load marks for selected student
  useEffect(() => {
    if (!selectedStudentId) return;

    async function loadStudentDetail() {
      try {
        const res = await fetch(`/api/v1/students/${selectedStudentId}`);
        const json = await res.json();
        if (json.success) {
          setCurrentMarks(json.data.student.marks || {});
          setSavedStatus("Synced");
        }
      } catch (err) {
        console.error("Failed to load student details", err);
      }
    }
    loadStudentDetail();
  }, [selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Debounced auto-sync with server backend
  const persistToServer = useCallback(
    async (studentId: string, marks: Record<string, RawMark>) => {
      try {
        setSavedStatus("Saving...");
        const res = await fetch(`/api/v1/students/${studentId}/marks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marks }),
        });
        const json = await res.json();
        if (json.success) {
          setSavedStatus("Auto-saved");
          setTimeout(() => setSavedStatus("Synced"), 1200);
        }
      } catch (err) {
        console.error("Auto-sync error", err);
        setSavedStatus("Save Error");
      }
    },
    []
  );

  const updateMarksAndSync = useCallback((newMarks: Record<string, RawMark>) => {
    setCurrentMarks(newMarks);
    // Debounce server persist by 500ms — avoids saving partial keystrokes
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (selectedStudentId) {
        persistToServer(selectedStudentId, newMarks);
      }
    }, 500);
  }, [selectedStudentId, persistToServer]);

  const handleTheoryChange = (code: string, value: string) => {
    // Allow empty string while typing; only clamp on valid numbers
    if (value === "") {
      const current = currentMarks[code];
      const prevPractical =
        typeof current === "object" && current !== null ? current.practical : 0;
      const updated = { ...currentMarks, [code]: { theory: 0, practical: prevPractical } };
      updateMarksAndSync(updated);
      return;
    }
    const num = Math.min(75, Math.max(0, parseInt(value, 10) || 0));
    const current = currentMarks[code];
    const prevPractical =
      typeof current === "object" && current !== null ? current.practical : 0;
    const updated = { ...currentMarks, [code]: { theory: num, practical: prevPractical } };
    updateMarksAndSync(updated);
  };

  const handlePracticalChange = (code: string, value: string) => {
    if (value === "") {
      const current = currentMarks[code];
      const prevTheory =
        typeof current === "object" && current !== null ? current.theory : 0;
      const updated = { ...currentMarks, [code]: { theory: prevTheory, practical: 0 } };
      updateMarksAndSync(updated);
      return;
    }
    const num = Math.min(25, Math.max(0, parseInt(value, 10) || 0));
    const current = currentMarks[code];
    const prevTheory =
      typeof current === "object" && current !== null ? current.theory : 0;
    const updated = { ...currentMarks, [code]: { theory: prevTheory, practical: num } };
    updateMarksAndSync(updated);
  };

  const handleNonPracticalChange = (code: string, value: string) => {
    if (value === "") {
      updateMarksAndSync({ ...currentMarks, [code]: 0 });
      return;
    }
    const num = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    updateMarksAndSync({ ...currentMarks, [code]: num });
  };

  const toggleAbsent = (code: string) => {
    let updated: Record<string, RawMark>;
    if (currentMarks[code] === "AB") {
      const isPrac = ["PHY", "CHE", "BIO", "HMT", "AGR"].includes(code);
      updated = {
        ...currentMarks,
        [code]: isPrac ? { theory: 50, practical: 15 } : 50,
      };
    } else {
      updated = {
        ...currentMarks,
        [code]: "AB",
      };
    }
    updateMarksAndSync(updated);
  };

  // Instant Real-Time Recalculation via engine without clicking any button
  const liveResult = useMemo(() => {
    if (!selectedStudent) return null;
    try {
      return calculateStudentGPA({
        id: selectedStudent.id,
        name: selectedStudent.name,
        class: selectedStudent.class,
        roll: selectedStudent.roll,
        optional: selectedStudent.optional,
        marks: currentMarks,
      });
    } catch {
      return null;
    }
  }, [selectedStudent, currentMarks]);

  const allSubjectDefinitions = [
    { code: "BAN", name: "Bangla", isPractical: false },
    { code: "ENG", name: "English", isPractical: false },
    { code: "MAT", name: "Mathematics", isPractical: false },
    { code: "REL", name: "Religion", isPractical: false },
    { code: "PHY", name: "Physics", isPractical: true },
    { code: "CHE", name: "Chemistry", isPractical: true },
    { code: "BIO", name: "Biology", isPractical: true },
    { code: "HMT", name: "Higher Mathematics", isPractical: true },
    { code: "AGR", name: "Agriculture", isPractical: true },
  ];

  const subjectsConfig = allSubjectDefinitions.map((sub) => ({
    ...sub,
    compulsory: sub.code !== selectedStudent?.optional,
  }));

  return (
    <Shell>
      <Header
        title="Assign Marks"
        subtitle="Live real-time score editor with instant grade calculation and automatic sync"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        {selectedStudent ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            {/* Student Info Bar & Real-Time Sync Indicator with Integrated Student Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Integrated Student Dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Select Student ({students.length})
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStudentId || ""}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          Roll {s.roll} • {s.name} ({s.id}) — 4th: {s.optional}
                        </option>
                      ))}
                    </select>

                    {/* Stepper Buttons for quick navigation */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const idx = students.findIndex((s) => s.id === selectedStudentId);
                          if (idx > 0) setSelectedStudentId(students[idx - 1].id);
                        }}
                        disabled={students.findIndex((s) => s.id === selectedStudentId) === 0}
                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-bold text-slate-700 transition-colors"
                        title="Previous Student"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => {
                          const idx = students.findIndex((s) => s.id === selectedStudentId);
                          if (idx >= 0 && idx < students.length - 1) setSelectedStudentId(students[idx + 1].id);
                        }}
                        disabled={students.findIndex((s) => s.id === selectedStudentId) === students.length - 1}
                        className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-bold text-slate-700 transition-colors"
                        title="Next Student"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Details Summary & Real-time Status Badge */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-bold text-sm text-slate-900">{selectedStudent.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {selectedStudent.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedStudent.class} • Roll {selectedStudent.roll} • 4th Optional:{" "}
                    <span className="font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-200">
                      {selectedStudent.optional}
                    </span>
                  </p>
                </div>

                {/* Real-time Status Badge */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{savedStatus}</span>
                </div>
              </div>
            </div>

            {/* Mark Input Table with Real-Time Grade for Each Subject */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Subject Marks Entry
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Grades recalculate instantly
                </span>
              </div>

                  <div className="space-y-2.5">
                    {subjectsConfig.map((sub) => {
                      const markVal = currentMarks[sub.code];
                      const isAbsent = markVal === "AB";
                      const isOptional = !sub.compulsory;
                      const theoryVal =
                        typeof markVal === "object" && markVal !== null
                          ? markVal.theory
                          : 0;
                      const practicalVal =
                        typeof markVal === "object" && markVal !== null
                          ? markVal.practical
                          : 0;
                      const nonPracVal = typeof markVal === "number" ? markVal : 0;

                      // Live individual subject evaluation
                      const subEval = evaluateSubjectMark(sub.code as any, markVal ?? 0, sub.compulsory);

                      const isTheoryFail = sub.isPractical && !isAbsent && theoryVal < 25;
                      const isPracticalFail = sub.isPractical && !isAbsent && practicalVal < 8;
                      const isNonPracFail = !sub.isPractical && !isAbsent && nonPracVal < 33;

                      return (
                        <div
                          key={sub.code}
                          className={`p-3.5 rounded-xl border-2 transition-all flex flex-wrap items-center justify-between gap-3 text-xs ${
                            isAbsent
                              ? "bg-slate-100 border-slate-300"
                              : !subEval.isPassed
                              ? "bg-red-50/80 border-red-300"
                              : isOptional
                              ? "bg-gradient-to-r from-purple-50 via-fuchsia-50/60 to-purple-50/40 border-purple-400 shadow-xs ring-1 ring-purple-300/60"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          {/* Subject Code & Name */}
                          <div className="w-44 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-sm">{sub.code}</span>
                              <span className="text-slate-800 font-semibold truncate">{sub.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {isOptional ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white font-mono shadow-xs animate-pulse">
                                  ★ 4th OPTIONAL
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono font-medium">
                                  Compulsory
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Marks Input Fields */}
                          <div className="flex items-center gap-3">
                            {isAbsent ? (
                              <span className="font-mono font-bold text-slate-700 px-4 py-1.5 bg-slate-200 rounded border border-slate-300">
                                Marked Absent (AB)
                              </span>
                            ) : sub.isPractical ? (
                              <div className="flex items-center gap-2 font-mono">
                                <div className="space-y-0.5">
                                  <label className="text-[10px] text-slate-500 block">Theory (/75)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={75}
                                    value={theoryVal}
                                    onChange={(e) => handleTheoryChange(sub.code, e.target.value)}
                                    className={`w-16 px-2 py-1 bg-white border rounded text-center text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                                      isTheoryFail ? "border-red-500 text-red-900 bg-red-50" : "border-slate-300 text-slate-900"
                                    }`}
                                  />
                                </div>
                                <span className="text-slate-400 mt-3">+</span>
                                <div className="space-y-0.5">
                                  <label className="text-[10px] text-slate-500 block">Practical (/25)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={25}
                                    value={practicalVal}
                                    onChange={(e) => handlePracticalChange(sub.code, e.target.value)}
                                    className={`w-16 px-2 py-1 bg-white border rounded text-center text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                                      isPracticalFail ? "border-red-500 text-red-900 bg-red-50" : "border-slate-300 text-slate-900"
                                    }`}
                                  />
                                </div>
                                <div className="space-y-0.5 pl-2">
                                  <label className="text-[10px] text-slate-500 block">Total</label>
                                  <span className="font-bold text-slate-900 block py-1">
                                    ={theoryVal + practicalVal}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 font-mono">
                                <div className="space-y-0.5">
                                  <label className="text-[10px] text-slate-500 block">Marks (/100)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={nonPracVal}
                                    onChange={(e) => handleNonPracticalChange(sub.code, e.target.value)}
                                    className={`w-20 px-2 py-1 bg-white border rounded text-center text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                                      isNonPracFail ? "border-red-500 text-red-900 bg-red-50" : "border-slate-300 text-slate-900"
                                    }`}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Absent Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleAbsent(sub.code)}
                              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold border transition-all ${
                                isAbsent
                                  ? "bg-slate-800 text-white border-slate-900"
                                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              AB
                            </button>
                          </div>

                          {/* Individual Subject Live Grade & GP Badge */}
                          <div className="flex items-center gap-2 min-w-[130px] justify-end font-mono">
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-900">
                                GP {subEval.gradePoint.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {isAbsent ? "Absent" : `Total: ${subEval.totalMark}`}
                              </div>
                            </div>
                            <GradeBadge grade={subEval.letterGrade} size="sm" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instant Real-Time Engine Verdict Card */}
                {liveResult && (
                  <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 font-mono text-xs shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                        Live Calculated Verdict
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-sans">Final Grade:</span>
                        <GradeBadge grade={liveResult.finalLetterGrade} size="md" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Compulsory Sum:</span>
                        <span className="font-bold text-white">
                          {liveResult.compulsoryGPsSum.toFixed(2)} / 30.00
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Optional 4th Bonus:</span>
                        <span className="font-bold text-purple-400">
                          +{liveResult.optionalBonusGP.toFixed(2)} GP
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Raw Uncapped GPA:</span>
                        <span className="font-bold text-slate-300">
                          {liveResult.rawGPA.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Final Deterministic GPA:</span>
                        <span className="font-bold text-emerald-400 text-sm">
                          {liveResult.finalGPA.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                No students found for this class.
              </div>
            )}
      </main>
    </Shell>
  );
}
