"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  ArrowUpRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart as RechartsPie,
  Pie,
} from "recharts";

export default function DashboardOverviewPage() {
  const [activeClassId, setActiveClassId] = useState("ALL");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
          " • " +
          now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async (classId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/results?classId=${classId}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeClassId);
  }, [activeClassId]);

  const summary = data?.summary;
  const gradeDist = summary?.gradeDistribution || {
    "A+": 0, A: 0, "A-": 0, B: 0, C: 0, D: 0, F: 0,
  };
  const total = summary?.totalStudents || 60;

  // Recharts Bar Data with counts
  const barChartData = [
    { grade: "A+", count: gradeDist["A+"] || 0, color: "#059669" },
    { grade: "A", count: gradeDist["A"] || 0, color: "#10b981" },
    { grade: "A-", count: gradeDist["A-"] || 0, color: "#0d9488" },
    { grade: "B", count: gradeDist["B"] || 0, color: "#2563eb" },
    { grade: "C", count: gradeDist["C"] || 0, color: "#d97706" },
    { grade: "D", count: gradeDist["D"] || 0, color: "#ea580c" },
    { grade: "F", count: gradeDist["F"] || 0, color: "#dc2626" },
  ];

  // Recharts Donut Data
  const passedCount = summary?.passedStudents ?? 0;
  const failedCount = summary?.failedStudents ?? 0;
  const practicalFailCount = summary?.flaggedCount?.practicalFail ?? 0;
  const absentCount = summary?.flaggedCount?.absent ?? 0;

  const donutData = [
    { name: "Passed Students", value: passedCount, color: "#2563eb" },
    { name: "Fails in Compulsory", value: failedCount, color: "#dc2626" },
    { name: "Failed in Practical (<8)", value: practicalFailCount, color: "#d97706" },
    { name: "Total Absent (AB)", value: absentCount, color: "#64748b" },
  ];

  const gradeRanges = [
    { range: "80 – 100", grade: "A+", gp: "5.00", color: "bg-emerald-50 border-emerald-200 text-emerald-900", badgeColor: "bg-emerald-600 text-white" },
    { range: "70 – 79", grade: "A", gp: "4.00", color: "bg-emerald-50/70 border-emerald-200 text-emerald-800", badgeColor: "bg-emerald-500 text-white" },
    { range: "60 – 69", grade: "A-", gp: "3.50", color: "bg-teal-50 border-teal-200 text-teal-900", badgeColor: "bg-teal-600 text-white" },
    { range: "50 – 59", grade: "B", gp: "3.00", color: "bg-blue-50 border-blue-200 text-blue-900", badgeColor: "bg-blue-600 text-white" },
    { range: "40 – 49", grade: "C", gp: "2.00", color: "bg-amber-50 border-amber-200 text-amber-900", badgeColor: "bg-amber-500 text-white" },
    { range: "33 – 39", grade: "D", gp: "1.00", color: "bg-orange-50 border-orange-200 text-orange-900", badgeColor: "bg-orange-500 text-white" },
    { range: "0 – 32", grade: "F", gp: "0.00", color: "bg-red-50 border-red-200 text-red-900", badgeColor: "bg-red-600 text-white" },
  ];

  return (
    <Shell noScroll>
      <div className="h-full max-h-screen overflow-hidden p-4 lg:p-5 pb-8 flex flex-col justify-start gap-3.5 w-full bg-slate-50 select-none">

        {/* ─── 1. Header Row ─── */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-2.5 flex items-center justify-between shadow-xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              SR
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                Academic Result &amp; GPA Engine
              </h1>
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{currentTime}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-blue-600">Session 2026</span>
              </p>
            </div>
          </div>

          {/* Class Switcher with All (60), Class 9, and Class 10 */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {[
              { id: "ALL", label: "All Classes (60)" },
              { id: "c1010000-0000-0000-0000-000000000001", label: "Class 9 (30)" },
              { id: "c1010000-0000-0000-0000-000000000002", label: "Class 10 (30)" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveClassId(c.id)}
                className={`px-3 py-1 rounded-md font-semibold transition-all text-xs ${
                  activeClassId === c.id
                    ? "bg-white text-blue-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 2. KPI Cards Row ─── */}
        <div className="grid grid-cols-5 gap-3 flex-shrink-0">
          <KPICard
            icon={<Users className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50 border border-blue-100"
            value={summary?.totalStudents ?? 30}
            label="Total Students"
            sub="Class Cohort"
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<Award className="w-4 h-4 text-emerald-600" />}
            iconBg="bg-emerald-50 border border-emerald-100"
            value={`${summary?.passRate ?? 0}%`}
            valueColor="text-emerald-600"
            label="Overall Pass Rate"
            sub={`${summary?.passedStudents ?? 0} Passed`}
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50 border border-blue-100"
            value={summary?.averageGPA?.toFixed(2) ?? "0.00"}
            valueColor="text-blue-700"
            label="Average GPA"
            sub="Max 5.00 Scale"
            linkHref="/dashboard/reports"
          />
          <KPICard
            icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
            iconBg="bg-red-50 border border-red-100"
            value={summary?.failedStudents ?? 0}
            valueColor="text-red-600"
            label="Compulsory Fails"
            sub="Override to 0.00 F"
            linkHref="/dashboard/results?grade=F"
          />
          <KPICard
            icon={<ClipboardCheck className="w-4 h-4 text-amber-600" />}
            iconBg="bg-amber-50 border border-amber-100"
            value={summary?.flaggedCount?.total ?? 0}
            valueColor="text-amber-600"
            label="Needs Review"
            sub="Pre-Publication Flags"
            linkHref="/dashboard/checking-lists"
          />
        </div>

        {/* ─── 3. Main Analytics Grid (Compact Card Height with Large Inner Visuals) ─── */}
        <div className="grid grid-cols-12 gap-3 h-[250px] flex-shrink-0">

          {/* Left Panel: Grade Distribution Bar Chart (7 cols) */}
          <div className="col-span-7 bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-col justify-between h-full min-h-0">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <BarChart3 className="w-3 h-3" />
                </span>
                <h3 className="text-xs font-bold text-slate-900">
                  Grade Distribution Breakdown
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 font-bold px-2 py-0.2 rounded border border-slate-200">
                {total} Total
              </span>
            </div>

            {/* Recharts Responsive Bar Container with maximal chart fill */}
            <div className="flex-1 w-full min-h-0 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 16, right: 10, left: -22, bottom: -2 }}>
                  <XAxis
                    dataKey="grade"
                    stroke="#64748b"
                    fontSize={11}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                      padding: "4px 8px",
                    }}
                    formatter={(val: any) => [`${val} Students`, "Count"]}
                    labelStyle={{ fontWeight: "bold", color: "#93c5fd" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={46}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      fill="#0f172a"
                      fontSize={11}
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    />
                    {barChartData.map((entry) => (
                      <Cell key={`cell-${entry.grade}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel: Result Status Donut Chart (5 cols) */}
          <div className="col-span-5 bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-col justify-between h-full min-h-0">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <PieChart className="w-3 h-3" />
                </span>
                <h3 className="text-xs font-bold text-slate-900">
                  Result Status Proportion
                </h3>
              </div>
              <Link href="/dashboard/checking-lists" className="text-[11px] text-blue-600 font-bold hover:underline">
                Checking List &rarr;
              </Link>
            </div>

            <div className="flex-1 flex items-center gap-3 py-0.5 min-h-0">
              {/* Recharts Large Pie Donut */}
              <div className="relative w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={68}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`donut-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        borderRadius: "8px",
                        fontSize: "12px",
                        border: "none",
                        padding: "4px 8px",
                      }}
                      formatter={(val: any, name: any) => [`${val} students`, name]}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold font-mono text-slate-900 leading-none">
                    {summary?.passRate ?? 0}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Pass Rate</span>
                </div>
              </div>

              {/* 4 Status Rows with Compact Spacing */}
              <div className="space-y-1 flex-1 text-xs">
                <StatusRow color="bg-blue-600" label="passed students" value={passedCount} />
                <StatusRow color="bg-red-600" label="fails in compulsary" value={failedCount} />
                <StatusRow color="bg-amber-500" label="Failed in Practical" value={practicalFailCount} />
                <StatusRow color="bg-slate-500" label="total absent" value={absentCount} />
              </div>
            </div>
          </div>

        </div>

        {/* ─── 4. Bottom Row: Official Letter Grade & Mark Ranges (Left to Right Cards) ─── */}
        <div className="flex-shrink-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Grading Scale &amp; Mark Ranges
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              GPA Scale
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {gradeRanges.map((g) => (
              <div
                key={g.grade}
                className={`p-2 rounded-xl border ${g.color} flex items-center justify-between shadow-xs`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-mono text-slate-900">
                    {g.range}
                  </div>
                  <div className="text-[10px] font-mono text-slate-600">
                    GP {g.gp}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono ${g.badgeColor}`}>
                  {g.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Shell>
  );
}

function KPICard({
  icon,
  iconBg,
  value,
  valueColor = "text-slate-900",
  label,
  sub,
  linkHref,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  valueColor?: string;
  label: string;
  sub: string;
  linkHref: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
        <Link
          href={linkHref}
          className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          <span>View</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="pt-3 space-y-0.5">
        <div className={`text-4xl font-extrabold font-mono ${valueColor} leading-none tracking-tight`}>
          {value}
        </div>
        <div className="text-xs text-slate-800 font-bold truncate mt-1">{label}</div>
        <div className="text-[11px] text-slate-400 font-medium truncate">{sub}</div>
      </div>
    </div>
  );
}

function StatusRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-slate-700 font-medium text-xs truncate">{label}</span>
      </div>
      <span className="font-mono font-bold text-slate-900 text-xs">{value}</span>
    </div>
  );
}
