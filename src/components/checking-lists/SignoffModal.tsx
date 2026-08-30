"use client";

import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

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
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Failed to verify flag", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Audit Verification Sign-Off
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Student:</span>
            <span className="font-mono text-slate-900">{flag.studentName} ({flag.studentCode})</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700">Flag Type:</span>
            <span className="font-mono text-amber-700 font-bold">{flag.flagType}</span>
          </div>
          <div className="pt-1 text-slate-600">
            <span className="font-semibold">Reason:</span> {flag.triggerReason}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Verification Decision
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("VERIFIED")}
                className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                  status === "VERIFIED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                ✓ Verified Correct
              </button>
              <button
                type="button"
                onClick={() => setStatus("CORRECTION_REQUIRED")}
                className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                  status === "CORRECTION_REQUIRED"
                    ? "bg-red-50 border-red-500 text-red-800 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                ⚠ Mark Correction Needed
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Verified By (Teacher / Administrator)
            </label>
            <input
              type="text"
              required
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Audit Notes & Physical Script Verification
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Cross-checked with physical answer script and mark sheet..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
            >
              {loading ? "Recording..." : "Save Sign-Off"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
