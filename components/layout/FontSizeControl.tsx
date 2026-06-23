"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { id: "small", label: "A−", scale: "0.9" },
  { id: "normal", label: "A", scale: "1" },
  { id: "large", label: "A+", scale: "1.125" },
] as const;

type FontSizeId = (typeof SIZES)[number]["id"];

type FontSizeControlProps = {
  variant?: "dark" | "light";
};

export function FontSizeControl({ variant = "dark" }: FontSizeControlProps) {
  const [size, setSize] = useState<FontSizeId>("normal");

  useEffect(() => {
    const saved = localStorage.getItem("rkm-font-size") as FontSizeId | null;
    if (saved && SIZES.some((s) => s.id === saved)) {
      setSize(saved);
      document.documentElement.dataset.fontSize = saved;
    }
  }, []);

  function apply(id: FontSizeId) {
    setSize(id);
    document.documentElement.dataset.fontSize = id;
    localStorage.setItem("rkm-font-size", id);
  }

  const isLight = variant === "light";

  return (
    <div
      className={`flex items-center gap-0.5 rounded-md border px-1 ${
        isLight ? "border-gray-200 bg-gray-50" : "border-white/20 bg-white/5"
      }`}
      role="group"
      aria-label="Font size"
    >
      {SIZES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => apply(s.id)}
          className={`min-w-7 h-6 text-[10px] font-bold rounded transition-colors ${
            size === s.id
              ? "bg-[#F5C200] text-[#0D2660]"
              : isLight
                ? "text-gray-600 hover:text-[#0D2660]"
                : "text-white/80 hover:text-[#F5C200]"
          }`}
          aria-pressed={size === s.id}
          aria-label={`Font size ${s.label}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
