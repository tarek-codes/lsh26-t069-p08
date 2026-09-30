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
import { SAMPLE_FILES, MIXED_NOTES, DEFAULT_SAMPLE, type SampleFile } from "./samples";

export default function ImportMarksPage() {
  const [activeClassId, setActiveClassId] = useState<string | undefined>("c1010000-0000-0000-0000-000000000001");
  const [inputText, setInputText] = useState<string>(DEFAULT_SAMPLE);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [commitSuccess, setCommitSuccess] = useState<{ insertedCount: number; updatedCount: number; persisted: boolean } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    if (validationResult.rejectedRows.length > 0) {
      alert("Fix all rejected rows before importing. Only fully valid files can be committed.");
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
        }),
      });

      const json = await res.json();
      if (json.success) {
        setConfirmOpen(false);
        setCommitSuccess({
          insertedCount: json.data.insertedCount,
          updatedCount: json.data.updatedCount,
          persisted: json.data.persisted !== false,
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

  const downloadSample = (f: SampleFile) => {
    const url = URL.createObjectURL(new Blob([f.content], { type: f.mime }));
    const a = document.createElement("a");
    a.href = url;
    a.download = f.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = (f: SampleFile) => {
    setInputText(f.content);
    setValidationResult(null);
    setCommitSuccess(null);
  };

  return (
    <Shell>
      <Header
        title="Import Marks Sheet"
        subtitle="Paste or upload marks sheets with row-by-row validation diagnostics and detailed rejection reporting"
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Success Banner if committed */}
        {commitSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Import &amp; Recalculation Complete!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  <strong>{commitSuccess.insertedCount} new {commitSuccess.insertedCount === 1 ? "student" : "students"}</strong> added and{" "}
                  <strong>{commitSuccess.updatedCount} {commitSuccess.updatedCount === 1 ? "student's" : "students'"} marks</strong> updated.{" "}
                  {commitSuccess.persisted
                    ? "Saved to the database; results, checking lists and reports are refreshed."
                    : "Warning: the database is not connected, so these changes are temporary and will be lost when the server restarts."}
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

        {/* Example files */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--fg)" }}>
              <Download className="w-4 h-4" style={{ color: "var(--accent)" }} />
              <span>Example Files</span>
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
              Download a sample to see the expected layout, or load it into the box above and try Validate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_FILES.map((f) => (
              <div
                key={f.id}
                className="rounded-xl border p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: f.tone === "valid" ? "rgba(5,150,105,0.45)" : "rgba(217,119,6,0.5)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: f.tone === "valid" ? "#047857" : "#b45309" }}
                    >
                      {f.tone === "valid" ? "ALL VALID" : "VALID + INVALID"}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>{f.title}</span>
                  </div>
                  <span
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border"
                    style={{ color: "var(--fg-muted)", borderColor: "var(--border-strong)", backgroundColor: "var(--surface)" }}
                  >
                    {f.format}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>{f.description}</p>
                {f.tone === "mixed" && f.format === "CSV" && (
                  <ul className="text-[11px] space-y-0.5 list-disc pl-4" style={{ color: "var(--fg-muted)" }}>
                    {MIXED_NOTES.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-2 mt-auto">
                  <button type="button" onClick={() => downloadSample(f)} className="btn btn-primary btn-sm">
                    <Download />
                    <span>Download {f.filename.split(".").pop()}</span>
                  </button>
                  <button type="button" onClick={() => loadSample(f)} className="btn btn-secondary btn-sm">
                    Load into box
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input & Upload Controls Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload or Paste Marks Sheet</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports CSV or JSON format. Practical subjects can be formatted as <code>Theory+Practical</code> (e.g. <code>60+20</code>) or <code>AB</code>.
              </p>
            </div>

            {/* Sample Loaders & Upload File */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-200">
                <FileText className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

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
              className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
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
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2"
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
                  <p className="text-[11px] text-purple-600">
                    {validationResult.summary.rejected > 0
                      ? "Fix all rejected rows to enable import"
                      : "Import all rows into database"}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={importing || validationResult.summary.accepted === 0 || validationResult.summary.rejected > 0}
                  className="w-full mt-2 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {importing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Database className="w-3.5 h-3.5" />
                  )}
                  <span>{validationResult.summary.rejected > 0 ? "Cannot Commit" : `Commit ${validationResult.summary.accepted} Rows`}</span>
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
                                    <span className="px-2 py-0.5 rounded-sm bg-red-100 text-red-900 font-bold border border-red-200">
                                      {err.invalidValue !== undefined ? String(err.invalidValue) : "EMPTY"}
                                    </span>
                                  </td>

                                  <td className="py-3 px-4 text-slate-800">
                                    <p className="font-medium text-slate-900">{err.reason}</p>
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
                                  <div className="font-bold text-slate-900 flex items-center gap-2">
                                    {row.student.name}
                                    <span
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white font-mono"
                                      style={{ backgroundColor: row.action === "INSERT" ? "#047857" : "#1d4ed8" }}
                                    >
                                      {row.action === "INSERT" ? "NEW" : "MARKS UPDATE"}
                                    </span>
                                  </div>
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

      {confirmOpen && validationResult && (() => {
        const inserts = validationResult.acceptedRows.filter((r: any) => r.action === "INSERT");
        const updates = validationResult.acceptedRows.filter((r: any) => r.action === "UPDATE");
        return (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <div
              className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--fg)" }}
            >
              <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }}>
                <h3 id="confirm-title" className="font-bold text-base">Confirm Import</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                  {inserts.length} new {inserts.length === 1 ? "student" : "students"} will be added
                  {updates.length > 0 && ` and ${updates.length} existing ${updates.length === 1 ? "student's" : "students'"} marks updated`}.
                  This changes the live results.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {inserts.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
                      New students to be added ({inserts.length})
                    </h4>
                    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border-strong)" }}>
                      <table className="w-full text-xs text-left">
                        <thead style={{ backgroundColor: "var(--bg-subtle)", color: "var(--fg-muted)" }}>
                          <tr className="uppercase text-[10px] tracking-wider">
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Roll</th>
                            <th className="px-3 py-2">Class</th>
                            <th className="px-3 py-2">4th Optional</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inserts.map((r: any) => (
                            <tr key={r.student.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                              <td className="px-3 py-2 font-mono font-semibold">{r.student.id}</td>
                              <td className="px-3 py-2 font-semibold">{r.student.name}</td>
                              <td className="px-3 py-2 font-mono">{r.student.roll}</td>
                              <td className="px-3 py-2">{r.student.class}</td>
                              <td className="px-3 py-2 font-mono font-bold">{r.student.optional}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {updates.length > 0 && (
                  <section>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
                      Existing students: marks will be updated ({updates.length})
                    </h4>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {updates.map((r: any) => `${r.student.name} (${r.student.id})`).join(", ")}
                    </p>
                  </section>
                )}
              </div>

              <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: "var(--border)" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)} disabled={importing}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCommit} disabled={importing}>
                  {importing ? <RefreshCw className="animate-spin" /> : <Database />}
                  <span>Confirm &amp; Import</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </Shell>
  );
}
