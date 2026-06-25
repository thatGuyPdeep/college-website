"use client";

import { useEffect, useState } from "react";
import { Accessibility } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FontSizeControl } from "@/components/layout/FontSizeControl";

type A11yFlags = {
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  bigCursor: boolean;
  dyslexiaFont: boolean;
  readingGuide: boolean;
};

const STORAGE_KEY = "rkm-a11y-flags";

const DEFAULT_FLAGS: A11yFlags = {
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  bigCursor: false,
  dyslexiaFont: false,
  readingGuide: false,
};

function applyBodyClasses(flags: A11yFlags) {
  const body = document.body;
  body.classList.toggle("a11y-high-contrast", flags.highContrast);
  body.classList.toggle("a11y-grayscale", flags.grayscale);
  body.classList.toggle("a11y-underline-links", flags.underlineLinks);
  body.classList.toggle("a11y-big-cursor", flags.bigCursor);
  body.classList.toggle("a11y-dyslexia-font", flags.dyslexiaFont);
  body.classList.toggle("a11y-reading-guide", flags.readingGuide);
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
      <span className="text-sm text-gray-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#C8201A]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
            checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

type AccessibilityPanelProps = {
  variant?: "dark" | "light";
};

/** IIT Delhi–inspired accessibility slide-in panel */
export function AccessibilityPanel({ variant = "dark" }: AccessibilityPanelProps) {
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<A11yFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = { ...DEFAULT_FLAGS, ...JSON.parse(saved) } as A11yFlags;
        setFlags(parsed);
        applyBodyClasses(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!flags.readingGuide) return;

    const line = document.createElement("div");
    line.id = "rkm-reading-guide";
    line.setAttribute("aria-hidden", "true");
    document.body.appendChild(line);

    const onMove = (e: MouseEvent) => {
      line.style.top = `${e.clientY}px`;
    };
    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
      line.remove();
    };
  }, [flags.readingGuide]);

  function update(partial: Partial<A11yFlags>) {
    setFlags((prev) => {
      const next = { ...prev, ...partial };
      applyBodyClasses(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetAll() {
    setFlags(DEFAULT_FLAGS);
    applyBodyClasses(DEFAULT_FLAGS);
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.dataset.fontSize = "normal";
    localStorage.setItem("rkm-font-size", "normal");
  }

  const isLight = variant === "light";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
          isLight
            ? "text-gray-600 hover:text-[#0D2660] hover:bg-gray-100"
            : "text-gray-400 hover:text-[#F5C200]"
        }`}
        aria-label="Accessibility settings"
      >
        <Accessibility className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline text-xs">Accessibility</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="a11y-sheet-content w-full sm:max-w-sm border-l-4 border-l-[#C8201A] p-0 bg-white text-gray-900 shadow-2xl"
      >
        <SheetHeader className="bg-[#0D2660] text-white p-4 shrink-0">
          <SheetTitle className="text-white">Accessibility Settings</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)] bg-white">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#0D2660] mb-2">Text</h3>
            <FontSizeControl variant="light" />
          </section>

          <section className="border-t pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#0D2660] mb-2">Visual</h3>
            <ToggleRow label="High contrast" checked={flags.highContrast} onChange={(v) => update({ highContrast: v })} />
            <ToggleRow label="Grayscale" checked={flags.grayscale} onChange={(v) => update({ grayscale: v })} />
            <ToggleRow label="Underline links" checked={flags.underlineLinks} onChange={(v) => update({ underlineLinks: v })} />
          </section>

          <section className="border-t pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#0D2660] mb-2">Reading aids</h3>
            <ToggleRow label="Dyslexia-friendly font" checked={flags.dyslexiaFont} onChange={(v) => update({ dyslexiaFont: v })} />
            <ToggleRow label="Big cursor" checked={flags.bigCursor} onChange={(v) => update({ bigCursor: v })} />
            <ToggleRow label="Reading guide" checked={flags.readingGuide} onChange={(v) => update({ readingGuide: v })} />
          </section>

          <button
            type="button"
            onClick={resetAll}
            className="w-full rounded-md bg-[#C8201A] text-white text-sm font-semibold py-2 hover:bg-[#9B1812] transition-colors"
          >
            Reset all settings
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
