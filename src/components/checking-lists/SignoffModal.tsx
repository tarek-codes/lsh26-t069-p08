"use client";

import { notifyDataChanged } from "@/lib/live-data";
import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

interface SignoffModalProps {
  flag: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SignoffModal({ flag, onClose, onSuccess }: SignoffModalProps) {
  const [status, setStatus] = useState<"VERIFIED" | "CORRECTION_REQUIRED" | "PENDING">("VERIFIED");
  const [verifiedBy, setVerifiedBy] = useState("Examination Controller");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!flag) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/checking-lists/${flag.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedByUser: verifiedBy,
          notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        notifyDataChanged();
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Failed to verify flag", err);
    } finally {
      setLoading(false);
    }
  };

  const flagLabel =
    flag.flagType === "OPTIONAL_LOW"
      ? "Optional subject rule"
      : flag.flagType === "PRACTICAL_FAIL"
      ? "Practical fail (< 8)"
      : flag.flagType === "ABSENT"
      ? "Absent mark (AB)"
      : flag.flagType;

  const decisions = [
    {
      value: "VERIFIED" as const,
      label: "Verified correct",
      hint: "Marks match the script",
      icon: CheckCircle,
      active: "border-emerald-500 bg-emerald-50 text-emerald-700",
    },
    {
      value: "CORRECTION_REQUIRED" as const,
      label: "Correction needed",
      hint: "Score must be updated",
      icon: AlertTriangle,
      active: "border-red-500 bg-red-50 text-red-700",
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signoff-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] no-print"
    >
      <div className="card w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-150">
        <div className="card-header">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent-subtle)] text-[var(--accent)]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 id="signoff-title" className="card-title">
                Verification sign-off
              </h3>
              <p className="card-subtitle">Record your decision for this flag</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost btn-sm w-8 px-0!">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-5">
            <dl className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[var(--fg-muted)]">Student</dt>
                <dd className="text-right text-[var(--fg)] font-medium">
                  {flag.studentName}
                  <span className="ml-2 font-mono text-xs font-normal text-[var(--fg-subtle)]">{flag.studentCode}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium text-[var(--fg-muted)]">Flag type</dt>
                <dd>
                  <span className="inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">
                    {flagLabel}
                  </span>
                </dd>
              </div>
              <div className="pt-2.5 border-t border-[var(--border)]">
                <dt className="text-xs font-medium text-[var(--fg-muted)] mb-1">Reason</dt>
                <dd className="text-[13px] leading-relaxed text-[var(--fg)]">{flag.triggerReason}</dd>
              </div>
            </dl>

            <fieldset>
              <legend className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5">
                Verification decision
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {decisions.map((d) => {
                  const Icon = d.icon;
                  const selected = status === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setStatus(d.value)}
                      className={`flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors ${
                        selected
                          ? d.active
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
                      }`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium">{d.label}</span>
                        <span className="block text-xs opacity-80">{d.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="signoff-verified-by" className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5">
                Verified by (teacher / administrator)
              </label>
              <input
                id="signoff-verified-by"
                type="text"
                required
                value={verifiedBy}
                onChange={(e) => setVerifiedBy(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="signoff-notes" className="block text-xs font-medium text-[var(--fg-muted)] mb-1.5">
                Review notes &amp; physical script verification
              </label>
              <textarea
                id="signoff-notes"
                rows={3}
                placeholder="e.g. Cross-checked with physical answer script and mark sheet…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input h-auto! py-2 leading-relaxed resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-alt)]">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              <span>{loading ? "Recording…" : "Save sign-off"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
