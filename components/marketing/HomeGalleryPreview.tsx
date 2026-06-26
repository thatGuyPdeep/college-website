"use client";

import Link from "next/link";
import Image from "next/image";
import { GALLERY_PHOTOS } from "@/lib/utils/constants";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";
import { StaggerReveal } from "@/components/ui/RevealOnScroll";

/** IIT Delhi — Photo Gallery grid preview */
export function HomeGalleryPreview() {
  const photos = GALLERY_PHOTOS.slice(0, 8);

  return (
    <section className="home-section bg-white">
      <div className="container-site">
        <HomeSectionHeading
          variant="centered"
          title="Photo "
          accent="Gallery"
          subtitle="Multi-hued reflections of campus life"
          viewAllHref="/gallery"
        />
        <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {photos.map((photo) => (
            <Link
              key={photo.src}
              href="/gallery"
              className="group relative aspect-square overflow-hidden border border-gray-200 micro-lift micro-press"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#0D2660]/0 group-hover:bg-[#0D2660]/65 transition-colors duration-300 flex items-end">
                <p className="p-2 text-[10px] sm:text-xs text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </Link>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
