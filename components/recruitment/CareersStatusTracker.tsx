"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { getMyFacultyApplications } from "@/lib/actions/recruitment";
import type { FacultyAppStatus } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<FacultyAppStatus, string> = {
  submitted:   "bg-blue-100 text-blue-800",
  shortlisted: "bg-green-100 text-green-800",
  interview:   "bg-purple-100 text-purple-800",
  rejected:    "bg-red-100 text-red-800",
  accepted:    "bg-emerald-100 text-emerald-800",
};

type AppRow = {
  id: string;
  status: FacultyAppStatus;
  created_at: string;
  vacancy: { title: string; designation: string | null } | null;
};

const POLL_MS = 12_000;

export function CareersStatusTracker({
  initialApps,
  justSubmitted,
}: {
  initialApps: AppRow[];
  justSubmitted?: boolean;
}) {
  const router = useRouter();
  const [apps, setApps] = useState(initialApps);
  const [pending, startTransition] = useTransition();
  const hasPendingReview = apps.some((a) => a.status === "submitted");
  const showBanner = justSubmitted || hasPendingReview;

  useEffect(() => {
    if (!showBanner) return;

    const poll = () => {
      startTransition(async () => {
        const result = await getMyFacultyApplications();
        if (!result.ok) return;
        setApps(result.data);
        const stillPending = result.data.some((a) => a.status === "submitted");
        if (!stillPending && justSubmitted) {
          router.replace("/careers/dashboard");
        }
      });
    };

    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [showBanner, justSubmitted, router]);

  if (apps.length === 0) return null;

  return (
    <>
      {showBanner && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 items-start">
          <RefreshCw className={`h-5 w-5 text-amber-700 shrink-0 mt-0.5 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-amber-900">Please do not reload this page</p>
            <p className="text-xs text-amber-800 mt-1">
              Your application status will update here automatically when the recruitment team reviews it.
              {pending && " Checking for updates…"}
            </p>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {apps.map((app) => (
          <li
            key={app.id}
            className="bg-white rounded-xl border border-blue-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <h2 className="font-semibold text-gray-900">{app.vacancy?.title ?? "Faculty Position"}</h2>
              <p className="text-xs text-gray-400 mt-1">
                Applied {new Date(app.created_at).toLocaleDateString("en-IN")}
              </p>
              {app.status === "submitted" && (
                <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                  Awaiting review — status updates without reloading
                </p>
              )}
            </div>
            <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
          </li>
        ))}
      </ul>
    </>
  );
}
