"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import {
  UploadCloud,
  FileText,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Copy,
  Download,
  Info,
  ChevronRight,
  Database,
} from "lucide-react";
import Link from "next/link";

const SAMPLE_VALID_CSV = `id,name,roll,class,optional,BAN,ENG,MAT,REL,PHY,CHE,BIO,HMT,AGR
S061,Ayesha Siddika,31,Class 9,HMT,82,78,85,90,62+22,58+20,65+21,68+24,60+20
S062,Mustafizur Rahman,32,Class 9,BIO,75,80,72,85,55+19,60+22,64+23,55+18,58+20
S063,Fatima Tuz Zohra,33,Class 9,AGR,88,86,92,95,68+24,66+23,70+25,65+22,72+25`;

const SAMPLE_MALFORMED_CSV = `id,name,roll,class,optional,BAN,ENG,MAT,REL,PHY,CHE,BIO,HMT,AGR
S071,Abdur Rahim,41,Class 9,CHEM,85,80,75,90,60+20,60+20,60+20,60+20,60+20
S072,Nayeem Hasan,42,Class 9,BIO,85,80,75,90,82+20,60+20,60+20,60+20,60+20
S073,Sharmin Akter,43,Class 9,HMT,85,80,75,90,60+30,60+20,60+20,60+20,60+20
S074,,44,Class 9,AGR,85,80,75,90,60+20,60+20,60+20,60+20,60+20
S072,Duplicate Student,45,Class 9,BIO,85,80,75,90,60+20,60+20,60+20,60+20,60+20
S075,Mahmudul Hasan,46,Class 9,BIO,85,115,75,90,60+20,60+20,60+20,60+20,60+20
S076,Rina Khatun,47,Class 9,HMT,85,80,75,90,60+20,invalid_format,60+20,60+20,60+20`;

export default function ImportMarksPage() {
  const [activeClassId, setActiveClassId] = useState<string | undefined>("c1010000-0000-0000-0000-000000000001");
  const [inputText, setInputText] = useState<string>(SAMPLE_MALFORMED_CSV);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [commitSuccess, setCommitSuccess] = useState<{ importedCount: number; className: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"rejected" | "accepted">("rejected");

  const handleValidate = async () => {
    try {
      setLoading(true);
      setCommitSuccess(null);
      const res = await fetch("/api/v1/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: inputText,
          action: "validate",
          classId: activeClassId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setValidationResult(json.data);
        if (json.data.rejectedRows.length === 0) {
          setActiveTab("accepted");
        } else {
          setActiveTab("rejected");
        }
      } else {
        alert(json.error?.message || "Failed to parse marks sheet");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during validation");
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!validationResult || validationResult.acceptedRows.length === 0) {
      alert("No valid rows available to import.");
      return;
    }

    try {
      setImporting(true);
      const res = await fetch("/api/v1/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: inputText,
          action: "commit",
          classId: activeClassId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCommitSuccess({
          importedCount: json.data.importedCount,
          className: json.data.targetClass.name,
        });
      } else {
        alert(json.error?.message || "Failed to commit students");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred during commit");
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setInputText(content);
      setValidationResult(null);
      setCommitSuccess(null);
    };
    reader.readAsText(file);
  };

  return (
    <Shell>
      <Header
        title="Import Marks Sheet"
        subtitle="Paste or upload marks sheets with row-by-row validation diagnostics and detailed rejection reporting"
        activeClassId={activeClassId}
        onClassChange={setActiveClassId}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Success Banner if committed */}
        {commitSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Import &amp; Recalculation Complete!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Successfully imported <strong>{commitSuccess.importedCount} students</strong> into{" "}
                  <strong>{commitSuccess.className}</strong> and updated live GPAs.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/results"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>View Class Results</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Input & Upload Controls Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload or Paste Marks Sheet</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports CSV, TSV, or JSON format. Practical subjects can be formatted as <code>Theory+Practical</code> (e.g. <code>60+20</code>) or <code>AB</code>.
              </p>
            </div>

            {/* Sample Loaders & Upload File */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-200">
                <FileText className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".csv,.tsv,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  setInputText(SAMPLE_VALID_CSV);
                  setValidationResult(null);
                  setCommitSuccess(null);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200"
              >
                Load Valid Sample
              </button>

              <button
                onClick={() => {
                  setInputText(SAMPLE_MALFORMED_CSV);
                  setValidationResult(null);
                  setCommitSuccess(null);
                }}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition-colors border border-amber-200"
              >
                Load Test Errors Sample
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setValidationResult(null);
              }}
              placeholder="Paste CSV or JSON marks data here..."
              className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Compulsory: <code>BAN, ENG, MAT, REL, PHY, CHE</code> • Optional: <code>BIO, HMT, AGR</code>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setInputText("")}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Clear
              </button>

              <button
                onClick={handleValidate}
                disabled={loading || !inputText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Validate &amp; Check Rows</span>
              </button>
            </div>
          </div>
        </div>

        {/* Validation Diagnostic Results */}
        {validationResult && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Total Rows Processed</span>
                <div className="text-2xl font-extrabold font-mono text-slate-900">
                  {validationResult.summary.total}
                </div>
                <p className="text-[11px] text-slate-400">Parsed input entries</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-1">
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Accepted (Valid)</span>
                </span>
                <div className="text-2xl font-extrabold font-mono text-emerald-900">
                  {validationResult.summary.accepted}
                </div>
                <p className="text-[11px] text-emerald-700">Ready for instant import</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs space-y-1">
                <span className="text-xs text-red-800 font-semibold flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                  <span>Rejected Rows</span>
                </span>
                <div className="text-2xl font-extrabold font-mono text-red-900">
                  {validationResult.summary.rejected}
                </div>
                <p className="text-[11px] text-red-700">Violated curriculum rules</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-purple-800 font-semibold">Commit Action</span>
                  <p className="text-[11px] text-purple-600">Import valid rows into database</p>
                </div>
                <button
                  onClick={handleCommit}
                  disabled={importing || validationResult.summary.accepted === 0}
                  className="w-full mt-2 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {importing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Database className="w-3.5 h-3.5" />
                  )}
                  <span>Commit {validationResult.summary.accepted} Valid Rows</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Table Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2">
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
                    activeTab === "rejected"
                      ? "bg-white text-red-700 border-t-2 border-t-red-600 border-x border-slate-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                  <span>Rejected Rows Report ({validationResult.summary.rejected})</span>
                </button>

                <button
                  onClick={() => setActiveTab("accepted")}
                  className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
                    activeTab === "accepted"
                      ? "bg-white text-emerald-700 border-t-2 border-t-emerald-600 border-x border-slate-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Accepted Rows Preview ({validationResult.summary.accepted})</span>
                </button>
              </div>

              {/* Tab Content: REJECTED ROWS */}
              {activeTab === "rejected" && (
                <div className="p-4 space-y-4">
                  {validationResult.rejectedRows.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-800">No Rejected Rows!</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        All rows in your marks sheet satisfied curriculum and bounds validation rules.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-red-50/50 text-red-950 uppercase text-[10px] tracking-wider font-bold border-b border-red-200">
                          <tr>
                            <th className="py-2.5 px-3 w-16">Row #</th>
                            <th className="py-2.5 px-3 min-w-[140px]">Student Info</th>
                            <th className="py-2.5 px-3 min-w-[120px]">Offending Field</th>
                            <th className="py-2.5 px-3 min-w-[100px]">Invalid Value</th>
                            <th className="py-2.5 px-4 min-w-[280px]">Exact Rejection Reason &amp; Rule</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Suggested Fix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-100/70 font-sans">
                          {validationResult.rejectedRows.map((row: any, rIdx: number) => (
                            <React.Fragment key={rIdx}>
                              {row.errors.map((err: any, eIdx: number) => (
                                <tr key={`${rIdx}-${eIdx}`} className="hover:bg-red-50/30 transition-colors">
                                  {eIdx === 0 ? (
                                    <td
                                      rowSpan={row.errors.length}
                                      className="py-3 px-3 font-mono font-bold text-slate-900 bg-slate-50/50 border-r border-slate-100 align-top"
                                    >
                                      Row {row.rowNumber}
                                    </td>
                                  ) : null}

                                  {eIdx === 0 ? (
                                    <td
                                      rowSpan={row.errors.length}
                                      className="py-3 px-3 align-top border-r border-slate-100"
                                    >
                                      <div className="font-bold text-slate-900">
                                        {row.studentName || <span className="text-red-600 italic">Missing Name</span>}
                                      </div>
                                      <div className="font-mono text-[10px] text-slate-500">
                                        {row.studentId || <span className="text-red-600 italic">No ID</span>}
                                      </div>
                                    </td>
                                  ) : null}

                                  <td className="py-3 px-3 font-mono font-bold text-red-700">
                                    {err.field}
                                  </td>

                                  <td className="py-3 px-3 font-mono">
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-900 font-bold border border-red-200">
                                      {err.invalidValue !== undefined ? String(err.invalidValue) : "EMPTY"}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 text-slate-800">
                                    <p className="font-medium text-slate-900">{err.reason}</p>
                                    <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      {err.ruleCode}
                                    </span>
                                  </td>

                                  <td className="py-3 px-3 text-slate-600 italic text-[11px]">
                                    {err.suggestedFix || "Correct value before re-uploading."}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: ACCEPTED ROWS PREVIEW */}
              {activeTab === "accepted" && (
                <div className="p-4 space-y-4">
                  {validationResult.acceptedRows.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <AlertOctagon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-800">No Valid Rows in Sheet</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Please review the rejection report and fix identified errors.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3 w-16">Row #</th>
                            <th className="py-2.5 px-3">Student</th>
                            <th className="py-2.5 px-2 text-center">4th Opt</th>
                            <th className="py-2.5 px-2 text-center">Compulsory Sum</th>
                            <th className="py-2.5 px-2 text-center">Opt Bonus</th>
                            <th className="py-2.5 px-2 text-center">Final GPA</th>
                            <th className="py-2.5 px-2 text-center">Grade</th>
                            <th className="py-2.5 px-3">Verdict Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {validationResult.acceptedRows.map((row: any, idx: number) => {
                            const res = row.previewResult;
                            return (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-3 font-bold text-slate-500">
                                  #{row.rowNumber}
                                </td>
                                <td className="py-3 px-3 font-sans">
                                  <div className="font-bold text-slate-900">{row.student.name}</div>
                                  <div className="font-mono text-[10px] text-slate-500">
                                    {row.student.id} • Roll {row.student.roll ?? "—"}
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center font-bold text-purple-700 bg-purple-50/50">
                                  {row.student.optional}
                                </td>
                                <td className="py-3 px-2 text-center text-slate-700">
                                  {res.compulsoryGPsSum.toFixed(2)} / 30
                                </td>
                                <td className="py-3 px-2 text-center text-purple-600 font-bold">
                                  +{res.optionalBonusGP.toFixed(2)}
                                </td>
                                <td className="py-3 px-2 text-center font-extrabold text-slate-900 text-sm">
                                  {res.finalGPA.toFixed(2)}
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <GradeBadge grade={res.finalLetterGrade} size="sm" />
                                </td>
                                <td className="py-3 px-3 font-sans">
                                  {res.isPassed ? (
                                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Passed</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                                      <AlertOctagon className="w-3.5 h-3.5" />
                                      <span>Failed ({res.failingCompulsorySubjects.join(", ")})</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}
