"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { HOME_WELCOME_VIDEO_ID } from "@/lib/content/portal-hubs";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/content/gallery-videos";
import { SITE_FULL_NAME, SITE_TAGLINE_EN } from "@/lib/utils/constants";

/** IIT Kanpur–style welcome block with institutional video */
export function HomeWelcomeVideo() {
  const [playing, setPlaying] = useState(false);
  const videoId = HOME_WELCOME_VIDEO_ID;

  return (
    <section className="bg-[#071540] text-white" aria-label="Welcome video">
      <div className="container-site py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <p className="text-[#F5C200] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Welcome
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {SITE_FULL_NAME}
            </h2>
            <p className="mt-4 text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
              A branch centre of Ramakrishna Math & Mission, Belur Math — serving tribal
              communities of Abujhmarh through value-based education, healthcare, and
              holistic development since 1985.
            </p>
            <p className="mt-3 text-sm text-[#F5C200]/90 italic">{SITE_TAGLINE_EN}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex px-5 py-2.5 bg-[#B80F0A] hover:bg-[#9B1812] text-white text-sm font-semibold uppercase tracking-wide"
              >
                Institute Overview
              </Link>
              <Link
                href="/gallery#videos"
                className="inline-flex px-5 py-2.5 border border-white/30 hover:bg-white/10 text-white text-sm font-semibold"
              >
                Video Gallery
              </Link>
            </div>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
            {playing ? (
              <iframe
                title={`${SITE_FULL_NAME} — institutional video`}
                src={`${youtubeEmbedUrl(videoId)}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full group"
                aria-label="Play institutional video"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumbnail(videoId)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <span className="absolute inset-0 bg-[#071540]/40 group-hover:bg-[#071540]/25 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#B80F0A] text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="h-7 w-7 ml-1" fill="currentColor" aria-hidden="true" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
