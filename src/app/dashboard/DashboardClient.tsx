"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLiveRefresh } from "@/lib/live-data";
import { Shell } from "@/components/layout/Shell";
import { CLASS_OPTIONS } from "@/components/layout/Header";
import { GradeBadge } from "@/components/common/GradeBadge";
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Ruler,
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
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
} from "recharts";

// Isolated so the 1s tick re-renders only this text, not the charts (which caused labels to flicker).
function LiveClock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) +
          " • " +
          d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{now ? `${now} · Session 2026` : "Session 2026"}</>;
}

export function DashboardClient({ initialData }: { initialData: any }) {
  const [activeClassId, setActiveClassId] = useState("ALL");
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const isFirstMount = useRef(true);

  const loadData = async (classId: string, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/v1/results?classId=${classId}`, { cache: "no-store" });
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
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    loadData(activeClassId);
  }, [activeClassId]);

  // Refresh silently when marks, imports or sign-offs change anywhere; also on first load,
  // because the server-rendered numbers can be older than the latest edit.
  useLiveRefresh(() => loadData(activeClassId, true), { onMount: true });

  const summary = data?.summary;
  const gradeDist = summary?.gradeDistribution || {
    "A+": 0, A: 0, "A-": 0, B: 0, C: 0, D: 0, F: 0,
  };
  const total = summary?.totalStudents || 60;

  // Recharts bar data with counts (colors follow the theme-aware grade tokens)
  const barChartData = [
    { grade: "A+", count: gradeDist["A+"] || 0, color: "var(--grade-aplus)" },
    { grade: "A", count: gradeDist["A"] || 0, color: "var(--grade-a)" },
    { grade: "A-", count: gradeDist["A-"] || 0, color: "var(--grade-aminus)" },
    { grade: "B", count: gradeDist["B"] || 0, color: "var(--grade-b)" },
    { grade: "C", count: gradeDist["C"] || 0, color: "var(--grade-c)" },
    { grade: "D", count: gradeDist["D"] || 0, color: "var(--grade-d)" },
    { grade: "F", count: gradeDist["F"] || 0, color: "var(--grade-f)" },
  ];

  // Recharts donut data
  const passedCount = summary?.passedStudents ?? 0;
  const failedCount = summary?.failedStudents ?? 0;
  const practicalFailCount = summary?.flaggedCount?.practicalFail ?? 0;
  const absentCount = summary?.flaggedCount?.absent ?? 0;

  const donutData = [
    { name: "Passed Students", value: passedCount, color: "var(--accent)" },
    { name: "Failed in Compulsory", value: failedCount, color: "var(--grade-f)" },
    { name: "Failed in Practical", value: practicalFailCount, color: "var(--grade-c)" },
    { name: "Exam Absents", value: absentCount, color: "#7c3aed" },
  ];

  const gradeRanges = [
    { range: "80–100", grade: "A+", gp: "5.00" },
    { range: "70–79", grade: "A", gp: "4.00" },
    { range: "60–69", grade: "A-", gp: "3.50" },
    { range: "50–59", grade: "B", gp: "3.00" },
    { range: "40–49", grade: "C", gp: "2.00" },
    { range: "33–39", grade: "D", gp: "1.00" },
    { range: "0–32", grade: "F", gp: "0.00" },
  ];

  const axisTick = { fill: "var(--fg-muted)", fontSize: 12 };

  return (
    <Shell>
      <main
        className={`dash-blue p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full transition-opacity ${
          loading && data ? "opacity-70" : ""
        }`}
      >
        {/* ─── Welcome + live clock ─── */}
        <section
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4"
          aria-label="Welcome"
        >
          <div className="hidden md:block" aria-hidden />
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--fg)]">Welcome Back</h1>
            <p
              className="text-sm tabular-nums text-[var(--fg-muted)] min-h-5"
              role="timer"
              aria-live="off"
              suppressHydrationWarning
            >
              <LiveClock />
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div role="tablist" aria-label="Select class" className="segmented">
              {[{ id: "ALL", label: "All classes", count: 60 }, ...CLASS_OPTIONS].map((cls) => (
                <button
                  key={cls.id}
                  role="tab"
                  aria-selected={activeClassId === cls.id}
                  onClick={() => setActiveClassId(cls.id)}
                >
                  {cls.label}
                  <span className="seg-count">{cls.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── KPI cards ─── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            icon={<Users />}
            tone="var(--accent)"
            value={summary?.totalStudents ?? 60}
            label="Total Students"
            sub="Class Cohort"
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<Award />}
            tone="var(--grade-a)"
            value={`${summary?.passRate ?? 0}%`}
            label="Overall Pass Rate"
            sub={`${summary?.passedStudents ?? 0} passed`}
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<TrendingUp />}
            tone="var(--opt-accent)"
            value={summary?.averageGPA?.toFixed(2) ?? "0.00"}
            label="Average GPA"
            sub="Out of 5.00"
            linkHref="/dashboard/reports"
          />
          <KPICard
            icon={<AlertTriangle />}
            tone="var(--grade-f)"
            value={summary?.failedStudents ?? 0}
            label="Compulsory Fails"
            sub="Overridden to 0.00 (F)"
            linkHref="/dashboard/results?grade=F"
          />
          <KPICard
            icon={<ClipboardCheck />}
            tone="var(--grade-c)"
            value={summary?.flaggedCount?.total ?? 0}
            label="Needs Review"
            sub="Pre-Publication Flags"
            linkHref="/dashboard/checking-lists"
          />
        </section>

        {/* ─── Charts ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grade distribution bar chart */}
          <div className="card card-tint lg:col-span-7 flex flex-col min-w-0">
            <div className="card-header">
              <div className="title-pill">
                <BarChart3 className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
                <h2 className="card-title truncate">Grade Distribution</h2>
              </div>
              <span className="whitespace-nowrap rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] px-2 py-0.5 text-xs font-medium text-[var(--fg-muted)] tabular-nums">
                {total} students
              </span>
            </div>

            <div className="h-72 px-4 pt-4 pb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis
                    dataKey="grade"
                    tick={{ ...axisTick, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    tickMargin={8}
                  />
                  <YAxis
                    tick={{ fill: "var(--fg-subtle)", fontSize: 11 }}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--bg-subtle)", radius: 6 } as any}
                    content={(props: any) => (
                      <ChartTooltip
                        {...props}
                        render={(p: any) => ({
                          title: `Grade ${p.payload.grade}`,
                          color: p.payload.color,
                          value: `${p.value} ${p.value === 1 ? "student" : "students"}`,
                        })}
                      />
                    )}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      offset={8}
                      fill="var(--fg)"
                      fontSize={12}
                      fontWeight={600}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    />
                    {barChartData.map((entry) => (
                      <Cell key={`cell-${entry.grade}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Result status donut chart */}
          <div className="card card-tint lg:col-span-5 flex flex-col min-w-0">
            <div className="card-header">
              <div className="title-pill">
                <PieChart className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
                <h2 className="card-title truncate">Result Status</h2>
              </div>
              <Link
                href="/dashboard/checking-lists"
                className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-medium text-[var(--accent)] hover:underline underline-offset-2"
              >
                Checking list
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-center gap-6 p-5">
              <div className="relative w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={80}
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke="transparent"
                      strokeWidth={2}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`donut-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={(props: any) => (
                        <ChartTooltip
                          {...props}
                          render={(p: any) => ({
                            title: p.name,
                            color: p.payload.color,
                            value: `${p.value} ${p.value === 1 ? "student" : "students"}`,
                          })}
                        />
                      )}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--fg)] leading-none">
                    {summary?.passRate ?? 0}%
                  </span>
                  <span className="text-xs font-medium text-[var(--fg-muted)] mt-1">Pass rate</span>
                </div>
              </div>

              <ul className="flex-1 min-w-0 max-w-72 space-y-2">
                {donutData.map((d) => (
                  <StatusRow key={d.name} color={d.color} label={d.name} value={d.value} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Grading scale ─── */}
        <section className="card card-tint overflow-hidden">
          <div className="card-header">
            <div className="title-pill">
              <Ruler className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
              <h2 className="card-title truncate">Grading Scale</h2>
            </div>
            <span className="card-subtitle whitespace-nowrap">GPA scale, max 5.00</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 p-5">
            {gradeRanges.map((g) => {
              const solid = GRADE_SOLID[g.grade] ?? GRADE_SOLID.F;
              return (
              <div
                key={g.grade}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  backgroundColor: solid[0],
                  boxShadow: "0 1px 2px rgba(16,24,40,0.10)",
                  color: "#fff",
                }}
              >
<span
                  className="inline-flex h-8 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-bold tabular-nums"
                  style={{ backgroundColor: "#fff", color: solid[0] }}
                >
                  {g.grade}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold tabular-nums whitespace-nowrap">
                    {g.range}
                  </div>
                  <div className="text-xs tabular-nums opacity-85 whitespace-nowrap">
                    GP {g.gp}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </section>
      </main>
    </Shell>
  );
}

const GRADE_SOLID: Record<string, [string, string]> = {
  "A+": ["#047857", "#10b981"],
  A: ["#15803d", "#22c55e"],
  "A-": ["#0f766e", "#14b8a6"],
  B: ["#1d4ed8", "#3b82f6"],
  C: ["#b45309", "#f59e0b"],
  D: ["#c2410c", "#f97316"],
  F: ["#b91c1c", "#ef4444"],
};

function ChartTooltip({
  active,
  payload,
  render,
}: {
  active?: boolean;
  payload?: any[];
  render: (p: any) => { title: string; color: string; value: string };
}) {
  if (!active || !payload?.length) return null;
  const { title, color, value } = render(payload[0]);
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-sm"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--fg)",
        boxShadow: "0 4px 12px rgba(16, 24, 40, 0.12)",
      }}
    >
      <div className="flex items-center gap-2 font-medium">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {title}
      </div>
      <div className="mt-0.5 pl-4 tabular-nums text-[var(--fg-muted)]">{value}</div>
    </div>
  );
}

function KPICard({
  icon,
  tone,
  value,
  label,
  sub,
  linkHref,
}: {
  icon: React.ReactNode;
  tone: string;
  value: string | number;
  label: string;
  sub: string;
  linkHref: string;
}) {
  const SOLID: Record<string, [string, string]> = {
    "var(--accent)": ["#1d4ed8", "#3b82f6"],
    "var(--grade-a)": ["#047857", "#10b981"],
    "var(--opt-accent)": ["#6d28d9", "#8b5cf6"],
    "var(--grade-f)": ["#b91c1c", "#ef4444"],
    "var(--grade-c)": ["#b45309", "#f59e0b"],
  };
  const solid = SOLID[tone] ?? SOLID["var(--accent)"];

  return (
    <Link
      href={linkHref}
      className="card group relative block p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
      style={{
        backgroundColor: solid[0],
        borderColor: "transparent",
        boxShadow: "0 1px 2px rgba(16,24,40,0.10)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]"
          style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.22)" }}
        >
          {icon}
        </span>
        <ArrowUpRight
          aria-hidden
          className="w-4 h-4 opacity-70 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={{ color: "#fff" }}
        />
      </div>
      <div className="mt-4" style={{ color: "#fff" }}>
        <div className="text-xs font-medium truncate opacity-90">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums leading-none">
          {value}
        </div>
        <div className="mt-2 text-xs truncate opacity-80">{sub}</div>
      </div>
    </Link>
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
  const SOLID: Record<string, [string, string]> = {
    "var(--accent)": ["#1d4ed8", "#3b82f6"],
    "var(--grade-f)": ["#b91c1c", "#ef4444"],
    "var(--grade-c)": ["#b45309", "#f59e0b"],
    "#7c3aed": ["#6d28d9", "#8b5cf6"],
  };
  const solid = SOLID[color] ?? SOLID["var(--accent)"];

  return (
    <li
      className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-3"
      style={{
        backgroundColor: solid[0],
        boxShadow: "0 1px 2px rgba(16,24,40,0.10)",
        color: "#fff",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-white/90" />
        <span className="text-[13px] font-medium truncate">{label}</span>
      </div>
      <span className="text-base font-bold tabular-nums">{value}</span>
    </li>
  );
}
