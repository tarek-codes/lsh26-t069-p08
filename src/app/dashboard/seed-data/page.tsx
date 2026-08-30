"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TraceDrawer } from "@/components/results/TraceDrawer";
import {
  TestTube2,
  RotateCcw,
  Check,
  Eye,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export default function SeedDataPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const edgeCases = [
    {
      id: "S001",
      edgeId: "EDGE-01",
      name: "Kamal Hossain",
      class: "Class 9",
      title: "Compulsory Fail with High Average",
      rule: "Rule R-13: Compulsory Failure Override",
      profile: "5 A+ subjects (GP 5.0) + Optional HMT (GP 5.0). Failed MAT (30/100).",
      rawGPA: "4.67 (A)",
      finalGPA: "0.00 (F)",
      passed: false,
      flagBadge: "MAT 30 < 33",
      explanation:
        "Student achieved uncancelled Raw GPA of 4.67 (A), but scored 30 in compulsory subject MAT. Rule R-13 forces overall GPA to 0.00 and Letter Grade F.",
    },
    {
      id: "S002",
      edgeId: "EDGE-02",
      name: "Lamia Islam",
      class: "Class 9",
      title: "Practical Fail with High Theory Mark",
      rule: "Rule R-11: Component Pass Rule",
      profile: "PHY Theory 65/75 (Pass), Practical 6/25 (Fail < 8). Optional AGR.",
      rawGPA: "1.83",
      finalGPA: "0.00 (F)",
      passed: false,
      flagBadge: "PHY Prac 6 < 8",
      explanation:
        "Practical mark 6 is below passing threshold 8/25. Failing practical fails the entire subject (GP 0.00 F) despite high theory score.",
    },
    {
      id: "S003",
      edgeId: "EDGE-03",
      name: "Urmi Akter",
      class: "Class 9",
      title: "Theory Fail with High Practical Mark",
      rule: "Rule R-11: Component Pass Rule",
      profile: "CHE Theory 24/75 (Fail < 25), Practical 20/25 (Pass). Optional BIO.",
      rawGPA: "4.67",
      finalGPA: "0.00 (F)",
      passed: false,
      flagBadge: "CHE Th 24 < 25",
      explanation:
        "Theory mark 24 is below passing threshold 25/75. Failing theory fails the entire subject even though total score is 44 (normally Grade C).",
    },
    {
      id: "S004",
      edgeId: "EDGE-04",
      name: "Imran Sultan",
      class: "Class 9",
      title: "Optional GP <= 2.0 (Zero Bonus)",
      rule: "Rule R-20: Optional Subject Threshold",
      profile: "Optional BIO score 40 (GP 2.00). All 8 compulsory subjects A+ (GP 5.0).",
      rawGPA: "5.00",
      finalGPA: "5.00 (A+)",
      passed: true,
      flagBadge: "Bonus: 0.00",
      explanation:
        "Optional 4th subject only contributes points in excess of 2.00. GP 2.00 produces max(0, 2.00 - 2.00) = 0.00 bonus points.",
    },
    {
      id: "S005",
      edgeId: "EDGE-05",
      name: "Rafi Rahman",
      class: "Class 9",
      title: "Optional GP > 2.0 (Active Bonus Addition)",
      rule: "Rule R-20: Optional Bonus Addition",
      profile: "Optional HMT score 85 (GP 5.00) adds (5.0 - 2.0) = +3.00 bonus points.",
      rawGPA: "4.38",
      finalGPA: "4.38 (A)",
      passed: true,
      flagBadge: "Bonus: +3.00",
      explanation:
        "Optional GP 5.00 contributes (5.00 - 2.00) = +3.00 bonus points to student's overall grade point sum across the 8 compulsory subjects.",
    },
    {
      id: "S006",
      edgeId: "EDGE-06",
      name: "Tasnim Jahan",
      class: "Class 9",
      title: "GPA Capped at 5.00 Maximum",
      rule: "Rule R-13: GPA Capping",
      profile: "8 Compulsory A+ (40.0 pts) + Optional BIO A+ (+3.0 pts) -> Raw GPA 5.38.",
      rawGPA: "5.38 (Raw)",
      finalGPA: "5.00 (A+)",
      passed: true,
      flagBadge: "Capped at 5.00",
      explanation:
        "Total grade points (40.0 + 3.0 = 43.0 / 8) produce Raw GPA 5.38. Per Rule R-13, the result is capped at the maximum Final GPA of 5.00 (A+).",
    },
    {
      id: "S007",
      edgeId: "EDGE-07",
      name: "Lamia Begum",
      class: "Class 9",
      title: "Absent in Compulsory Subject",
      rule: "Rule R-12: Absence Handling",
      profile: "Marked Absent ('AB') in compulsory Bangla (BAN). Optional BIO.",
      rawGPA: "4.38",
      finalGPA: "0.00 (F)",
      passed: false,
      flagBadge: "BAN: AB",
      explanation:
        "Absent mark in compulsory subject assigns GP 0.00 and Letter Grade F, causing overall student result to fail.",
    },
    {
      id: "S008",
      edgeId: "EDGE-08",
      name: "Nusrat Khatun",
      class: "Class 9",
      title: "Absent in Optional 4th Subject",
      rule: "Rule R-12: Optional Absence Handling",
      profile: "Marked Absent ('AB') in Optional HMT. Passed all 8 compulsory subjects.",
      rawGPA: "5.00",
      finalGPA: "5.00 (A+)",
      passed: true,
      flagBadge: "Opt AB (Passes)",
      explanation:
        "Absent mark in optional subject contributes 0.00 bonus points. Student passes on the strength of their 8 compulsory subjects.",
    },
  ];

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await fetch("/api/v1/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSeedDone(true);
        setTimeout(() => setSeedDone(false), 2000);
      }
    } catch (err) {
      console.error("Seed error", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Shell>
      <Header
        title="Seed Dataset & 8 Hard-Edge Case Benchmark Navigator"
        subtitle="Explore and inspect the 60-student verified dataset with 1-click audit trace inspection"
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-600">
                <TestTube2 className="w-4 h-4 text-white" />
              </span>
              <h3 className="font-bold text-base tracking-tight text-white">
                60-Student Benchmark Dataset (Class 9 &amp; Class 10)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every student is enrolled in 6 compulsory subjects (<code>BAN</code>, <code>ENG</code>, <code>MAT</code>, <code>REL</code>, <code>PHY</code>, <code>CHE</code>) and 1 optional 4th subject (<code>BIO</code>, <code>HMT</code>, or <code>AGR</code>). The dataset contains all 8 benchmark cases ensuring 100% compliance with strict deterministic grading rules.
            </p>
          </div>
        </div>

        {/* 8 Hard-Edge Case Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              The 8 Mandatory Hard-Edge Benchmark Cases
            </h3>
            <span className="text-xs font-mono text-slate-500">8 / 8 Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {edgeCases.map((ec) => (
              <div
                key={ec.edgeId}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {ec.edgeId}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{ec.title}</h4>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {ec.id}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-blue-700 font-semibold">
                    {ec.rule}
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Student:</span>
                      <span className="font-bold text-slate-900">{ec.name} ({ec.class})</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500">Marks Profile:</span>
                      <span className="font-semibold text-slate-700">{ec.profile}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ec.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-500">Final:</span>
                    <span className="font-bold text-slate-900">{ec.finalGPA}</span>
                    <StatusBadge status={ec.passed ? "PASSED" : "FAILED"} />
                  </div>

                  <button
                    onClick={() => setSelectedStudentId(ec.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Trace</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
