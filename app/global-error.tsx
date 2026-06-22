"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#FFFDF9] p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-[#0D2660] mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-600 mb-6">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-[#0D2660] text-white text-sm"
            >
              Try again
            </button>
            <a href="/" className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700">
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
