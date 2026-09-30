"use client";

import { useEffect, useRef } from "react";

const CHANNEL = "school-data-changed";

/** Call after any change to school data (marks, imports, sign-offs) so open pages refresh. */
export function notifyDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANNEL)); // this tab
  try {
    const bc = new BroadcastChannel(CHANNEL); // other tabs and windows
    bc.postMessage(Date.now());
    bc.close();
  } catch {
    // BroadcastChannel unavailable: the periodic refresh below still catches changes
  }
}

/**
 * Runs `refresh` whenever data changes elsewhere: in this tab, in another tab, when the
 * window regains focus, and every `intervalMs` while visible (covers other devices).
 */
export function useLiveRefresh(refresh: () => void, options: { intervalMs?: number; onMount?: boolean } = {}) {
  const { intervalMs = 15000, onMount = false } = options;
  const latest = useRef(refresh);
  latest.current = refresh;

  useEffect(() => {
    const run = () => latest.current();
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };

    if (onMount) run();
    window.addEventListener(CHANNEL, run);
    window.addEventListener("focus", run);
    document.addEventListener("visibilitychange", onVisible);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = run;
    } catch {
      bc = null;
    }

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") run();
    }, intervalMs);

    return () => {
      window.removeEventListener(CHANNEL, run);
      window.removeEventListener("focus", run);
      document.removeEventListener("visibilitychange", onVisible);
      bc?.close();
      clearInterval(timer);
    };
  }, [intervalMs, onMount]);
}
