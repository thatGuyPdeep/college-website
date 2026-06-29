"use client";

import { useEffect, useState } from "react";

const FALLBACK = 12_450;
const SESSION_KEY = "rkm-visitor-counted";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!sessionStorage.getItem(SESSION_KEY)) {
          sessionStorage.setItem(SESSION_KEY, "1");
          const inc = await fetch("/api/visitors", { method: "POST" });
          if (!inc.ok) throw new Error("increment failed");
          const incData = (await inc.json()) as { count?: number };
          if (!cancelled && typeof incData.count === "number") {
            setCount(incData.count);
            setLive(true);
            return;
          }
        }
        const res = await fetch("/api/visitors");
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { count?: number };
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
          setLive(true);
        }
      } catch {
        if (!cancelled) {
          setCount(FALLBACK);
          setLive(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = (count ?? FALLBACK).toLocaleString("en-IN");

  return (
    <span aria-live="polite" title={live ? "Live visitor count" : "Approximate visitor count"}>
      Visitors: {display}
      {!live && count === null ? " …" : ""}
    </span>
  );
}
