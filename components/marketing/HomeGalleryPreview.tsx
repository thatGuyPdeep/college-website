import Link from "next/link";
import Image from "next/image";
import { GALLERY_PHOTOS } from "@/lib/utils/constants";
import { HomeSectionHeading } from "@/components/marketing/HomeSectionHeading";

/** IIT Delhi — Photo Gallery grid preview */
export function HomeGalleryPreview() {
  const photos = GALLERY_PHOTOS.slice(0, 8);

  return (
    <section className="home-section bg-white">
      <div className="container-site">
        <HomeSectionHeading
          title="Photo Gallery"
          subtitle="Multi-hued reflections of campus life"
          viewAllHref="/gallery"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {photos.map((photo) => (
            <Link
              key={photo.src}
              href="/gallery"
              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#0D2660]/0 group-hover:bg-[#0D2660]/60 transition-colors flex items-end">
                <p className="p-2 text-[10px] sm:text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
