"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { Header } from "@/components/layout/Header";
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

export function DashboardClient({ initialData }: { initialData: any }) {
  const [activeClassId, setActiveClassId] = useState("ALL");
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const isFirstMount = useRef(true);

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
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    loadData(activeClassId);
  }, [activeClassId]);

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
    { name: "Passed students", value: passedCount, color: "var(--accent)" },
    { name: "Failed in compulsory", value: failedCount, color: "var(--grade-f)" },
    { name: "Failed in practical", value: practicalFailCount, color: "var(--grade-c)" },
    { name: "Exam absents", value: absentCount, color: "var(--fg-subtle)" },
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
      <Header
        title="Dashboard"
        subtitle={currentTime ? `${currentTime} · Session 2026` : "Session 2026"}
        activeClassId={activeClassId === "ALL" ? undefined : activeClassId}
        onClassChange={(id: string | undefined) => setActiveClassId(id ?? "ALL")}
        showAllOption
      />

      <main
        className={`p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full transition-opacity ${
          loading && data ? "opacity-70" : ""
        }`}
      >
        {/* ─── KPI cards ─── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            icon={<Users />}
            tone="var(--accent)"
            value={summary?.totalStudents ?? 60}
            label="Total students"
            sub="Class cohort"
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<Award />}
            tone="var(--grade-a)"
            value={`${summary?.passRate ?? 0}%`}
            label="Overall pass rate"
            sub={`${summary?.passedStudents ?? 0} passed`}
            linkHref="/dashboard/results"
          />
          <KPICard
            icon={<TrendingUp />}
            tone="var(--accent)"
            value={summary?.averageGPA?.toFixed(2) ?? "0.00"}
            label="Average GPA"
            sub="Out of 5.00"
            linkHref="/dashboard/reports"
          />
          <KPICard
            icon={<AlertTriangle />}
            tone="var(--grade-f)"
            value={summary?.failedStudents ?? 0}
            label="Compulsory fails"
            sub="Overridden to 0.00 (F)"
            linkHref="/dashboard/results?grade=F"
          />
          <KPICard
            icon={<ClipboardCheck />}
            tone="var(--grade-c)"
            value={summary?.flaggedCount?.total ?? 0}
            label="Needs review"
            sub="Pre-publication flags"
            linkHref="/dashboard/checking-lists"
          />
        </section>

        {/* ─── Charts ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grade distribution bar chart */}
          <div className="card lg:col-span-7 flex flex-col min-w-0">
            <div className="card-header">
              <div className="flex items-center gap-2 min-w-0">
                <BarChart3 className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
                <h2 className="card-title truncate">Grade distribution</h2>
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
          <div className="card lg:col-span-5 flex flex-col min-w-0">
            <div className="card-header">
              <div className="flex items-center gap-2 min-w-0">
                <PieChart className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
                <h2 className="card-title truncate">Result status</h2>
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
                      stroke="var(--surface)"
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

              <ul className="flex-1 min-w-0 max-w-64 divide-y divide-[var(--border)]">
                {donutData.map((d) => (
                  <StatusRow key={d.name} color={d.color} label={d.name} value={d.value} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Grading scale ─── */}
        <section className="card overflow-hidden">
          <div className="card-header">
            <div className="flex items-center gap-2 min-w-0">
              <Ruler className="w-4 h-4 text-[var(--fg-subtle)] shrink-0" />
              <h2 className="card-title truncate">Grading scale &amp; mark ranges</h2>
            </div>
            <span className="card-subtitle whitespace-nowrap">GPA scale, max 5.00</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7">
            {gradeRanges.map((g, i) => (
              <div
                key={g.grade}
                className={`flex flex-col items-start gap-2 px-5 py-4 ${
                  i > 0 ? "sm:border-l border-[var(--border)]" : ""
                }`}
              >
                <GradeBadge grade={g.grade} size="md" />
                <div>
                  <div className="text-sm font-semibold tabular-nums text-[var(--fg)] whitespace-nowrap">
                    {g.range}
                  </div>
                  <div className="text-xs tabular-nums text-[var(--fg-muted)] whitespace-nowrap">
                    GP {g.gp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}

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
  return (
    <Link
      href={linkHref}
      className="card group relative block p-5 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4"
          style={{
            color: tone,
            backgroundColor: `color-mix(in srgb, ${tone} 12%, transparent)`,
          }}
        >
          {icon}
        </span>
        <ArrowUpRight
          aria-hidden
          className="w-4 h-4 text-[var(--fg-subtle)] opacity-60 transition-all group-hover:opacity-100 group-hover:text-[var(--accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      <div className="mt-4">
        <div className="text-xs font-medium text-[var(--fg-muted)] truncate">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-[var(--fg)] leading-none">
          {value}
        </div>
        <div className="mt-2 text-xs text-[var(--fg-subtle)] truncate">{sub}</div>
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
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[13px] text-[var(--fg-muted)] truncate">{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums text-[var(--fg)]">{value}</span>
    </li>
  );
}
