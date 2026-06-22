"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { youtubeEmbedUrl, youtubeThumbnail, youtubeWatchUrl } from "@/lib/content/gallery-videos";

export function YouTubeVideoGrid({ videoIds }: { videoIds: string[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (videoIds.length === 0) return null;

  return (
    <div className="space-y-8">
      {activeId && (
        <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-blue-100 shadow-lg bg-black">
          <iframe
            title={`YouTube video ${activeId}`}
            src={`${youtubeEmbedUrl(activeId)}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoIds.map((id) => (
          <article
            key={id}
            className="group rounded-xl overflow-hidden border border-blue-100 bg-white card-lift"
          >
            <button
              type="button"
              onClick={() => setActiveId(id)}
              className="relative block w-full aspect-video text-left"
              aria-label={`Play video ${id}`}
            >
              <Image
                src={youtubeThumbnail(id)}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized
              />
              <span className="absolute inset-0 bg-[#0D2660]/30 group-hover:bg-[#0D2660]/40 transition-colors flex items-center justify-center">
                <span className="bg-[#C8201A] rounded-full p-3">
                  <Play className="h-6 w-6 text-white fill-white" aria-hidden="true" />
                </span>
              </span>
            </button>
            <div className="p-3 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500 truncate">Mission video</span>
              <a
                href={youtubeWatchUrl(id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0D2660] underline shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                YouTube
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
