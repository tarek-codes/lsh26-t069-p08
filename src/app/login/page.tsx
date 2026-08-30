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
  CheckCircle2,
  Cpu,
  Layers,
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
      className="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white"
    >
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
        className="h-16 px-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight" style={{ color: "var(--fg)" }}>
                School<span style={{ color: "var(--accent)" }}>Engine</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                Admin
              </span>
            </div>
            <p className="text-[10px] font-mono" style={{ color: "var(--fg-subtle)" }}>
              Examination Portal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-semibold hover:text-[var(--accent)] transition-colors"
            style={{ color: "var(--fg-muted)" }}
          >
            &larr; Back to Overview
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pattern-grid-light">
        <div className="w-full max-w-md space-y-4">
          {/* Card Container */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border-strong)",
            }}
            className="rounded-3xl border shadow-lg overflow-hidden"
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-[var(--accent)]" />

            <div className="p-8 space-y-6">
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div
                  style={{
                    backgroundColor: "var(--accent-subtle)",
                    borderColor: "var(--accent-border)",
                    color: "var(--accent)",
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorized Examination Access</span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                  style={{ color: "var(--fg)" }}
                >
                  Sign in
                </h1>
                <p className="text-xs leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  Enter your administrative credentials to access candidate grade sheets and verification rosters.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    borderColor: "#fecaca",
                    color: "#dc2626",
                  }}
                  className="flex items-center gap-2 p-3.5 rounded-xl text-xs border"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Status */}
                <div
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border)",
                  }}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs"
                >
                  <span className="font-medium" style={{ color: "var(--fg-muted)" }}>Role:</span>
                  <span
                    style={{
                      backgroundColor: "var(--accent-subtle)",
                      borderColor: "var(--accent-border)",
                      color: "var(--accent)",
                    }}
                    className="px-2.5 py-0.5 rounded-md font-mono font-bold text-[11px] border"
                  >
                    Examination Controller
                  </span>
                </div>

                {/* Username Input */}
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
                        borderColor: "var(--border)",
                        color: "var(--fg)",
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-[var(--fg-subtle)]"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      Password
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: "var(--fg-subtle)" }}>
                      Demo Mode Active
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
                        borderColor: "var(--border)",
                        color: "var(--fg)",
                      }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-[var(--fg-subtle)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-80 transition-opacity"
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

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                  className="w-full py-3 rounded-xl text-xs font-extrabold tracking-wide uppercase flex items-center justify-center gap-2 group disabled:opacity-50 hover:scale-101 active:scale-99 transition-all shadow-md"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Portal</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Pre-filled Credentials Box */}
              <div
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border)",
                }}
                className="rounded-2xl p-4 space-y-2.5 border"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <KeyRound className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    Default Demo Access
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--fg-subtle)" }}>Username:</span>
                    <span className="font-semibold" style={{ color: "var(--fg)" }}>
                      {username}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--fg-subtle)" }}>Password:</span>
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

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "var(--bg)",
          borderTop: "1px solid var(--border)",
          color: "var(--fg-subtle)",
        }}
        className="px-6 py-4 text-center text-xs font-mono"
      >
        SchoolEngine Security &bull; Problem P08 &bull; Deterministic Grade Tabulation Suite
      </footer>
    </div>
  );
}
