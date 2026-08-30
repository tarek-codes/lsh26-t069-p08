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
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="px-6 h-16 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-blue-500 transition-colors">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white flex items-center">
              School<span className="text-blue-500">Engine</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono leading-none">
              Result &amp; GPA Processing
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back to Overview
          </Link>
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Authentication Portal</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Sign in
              </h1>
              <p className="text-xs text-slate-400">
                Sign in to manage student results and publication checking rosters
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Indicator */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Access Level:</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800/50 text-blue-400 font-bold font-mono text-[11px]">
                  System Administrator
                </span>
              </div>

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Email / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@school.edu"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Demo Mode</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pre-Configured Credentials</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">Ready</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Username:</span>
                  <span className="font-semibold text-white">{username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Password:</span>
                  <span className="font-semibold text-white">{password}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 font-mono border-t border-slate-800 bg-slate-950">
        SchoolEngine • Problem P08 • National Secondary Curriculum GPA Processing System
      </footer>
    </div>
  );
}
