"use client";

import { useEffect, useState } from "react";

const FALLBACK = 12_450;
const SESSION_KEY = "rkm-visitor-counted";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!sessionStorage.getItem(SESSION_KEY)) {
          sessionStorage.setItem(SESSION_KEY, "1");
          const inc = await fetch("/api/visitors", { method: "POST" });
          const incData = (await inc.json()) as { count?: number };
          if (!cancelled && typeof incData.count === "number") {
            setCount(incData.count);
            return;
          }
        }
        const res = await fetch("/api/visitors");
        const data = (await res.json()) as { count?: number };
        if (!cancelled) setCount(typeof data.count === "number" ? data.count : FALLBACK);
      } catch {
        if (!cancelled) setCount(FALLBACK);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = (count ?? FALLBACK).toLocaleString("en-IN");

  return <span aria-live="polite">Visitors: {display}</span>;
}
