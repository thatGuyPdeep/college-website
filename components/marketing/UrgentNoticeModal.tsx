"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type UrgentNotice = {
  id: string;
  title: string;
  message: string;
  href: string;
  cta: string;
};

const STORAGE_KEY = "rkm-urgent-notice-dismissed";

export function UrgentNoticeModal({ notice }: { notice: UrgentNotice | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!notice) return;
    try {
      const dismissed = sessionStorage.getItem(`${STORAGE_KEY}-${notice.id}`);
      if (!dismissed) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [notice]);

  if (!notice || !open) return null;

  function dismiss() {
    try {
      sessionStorage.setItem(`${STORAGE_KEY}-${notice!.id}`, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="urgent-notice-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-t-4 border-[#C8201A]">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide text-[#C8201A]">Important Notice</span>
            <button
              type="button"
              onClick={dismiss}
              className="text-gray-400 hover:text-gray-700 p-1 rounded"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 id="urgent-notice-title" className="text-lg font-bold text-[#0D2660] mb-2">
            {notice.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{notice.message}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-[#C8201A] hover:bg-[#9B1812] text-white flex-1">
              <Link href={notice.href} onClick={dismiss}>{notice.cta}</Link>
            </Button>
            <Button type="button" variant="outline" onClick={dismiss} className="flex-1">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
