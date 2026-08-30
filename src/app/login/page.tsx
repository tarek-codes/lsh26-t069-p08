"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin@school.edu");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (username && password) {
        router.push("/dashboard");
      } else {
        setError("Please enter valid credentials.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      className="min-h-screen flex flex-col font-sans antialiased"
    >
      {/* ─── HEADER ─── */}
      <header
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
        className="h-16 px-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white group-hover:bg-[var(--accent-hover)] transition-colors">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight leading-none" style={{ color: "var(--fg)" }}>
              School<span style={{ color: "var(--accent)" }}>Engine</span>
            </p>
            <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--fg-subtle)" }}>
              Result &amp; GPA Processing
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--fg-muted)" }}
          >
            &larr; Back
          </Link>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Card */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            className="rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Card top accent bar */}
            <div className="h-1 w-full bg-[var(--accent)]" />

            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div
                  style={{
                    backgroundColor: "var(--accent-subtle)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authentication Portal
                </div>
                <h1
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: "var(--fg)" }}
                >
                  Sign in
                </h1>
                <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  Access the administrative portal to manage student results and checking rosters.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg text-xs"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Badge */}
                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                  }}
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs"
                >
                  <span style={{ color: "var(--fg-muted)" }}>Access Level</span>
                  <span
                    style={{
                      backgroundColor: "var(--accent-subtle)",
                      border: "1px solid var(--accent-border)",
                      color: "var(--accent)",
                    }}
                    className="px-2 py-0.5 rounded font-bold font-mono text-[11px]"
                  >
                    System Administrator
                  </span>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label
                    className="text-[11px] font-bold uppercase tracking-wider block"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    Email / Username
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--fg-subtle)" }}
                    />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin@school.edu"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-[var(--fg-subtle)]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      Password
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: "var(--fg-subtle)" }}>
                      Demo Mode
                    </span>
                  </div>
                  <div className="relative">
                    <Lock
                      className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--fg-subtle)" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                      }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-[var(--fg-subtle)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                      style={{ color: "var(--fg-subtle)" }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-50 transition-colors hover:bg-[var(--accent-hover)]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Enter Portal
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Credentials hint */}
              <div
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                }}
                className="rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <KeyRound className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    Pre-configured Credentials
                  </span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: "#10b981" }}>
                    Ready
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--fg-subtle)" }}>Username</span>
                    <span className="font-semibold" style={{ color: "var(--fg)" }}>
                      {username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--fg-subtle)" }}>Password</span>
                    <span className="font-semibold" style={{ color: "var(--fg)" }}>
                      {password}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-subtle)",
          color: "var(--fg-subtle)",
        }}
        className="px-6 py-4 text-center text-xs font-mono"
      >
        SchoolEngine &bull; Problem P08 &bull; National Secondary Curriculum GPA Processing System
      </footer>
    </div>
  );
}
