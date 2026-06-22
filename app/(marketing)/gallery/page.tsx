import type { Metadata } from "next";

import Image from "next/image";

import { Images, Play, ExternalLink } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";

import { SectionHeader } from "@/components/layout/SectionHeader";

import { YouTubeVideoGrid } from "@/components/gallery/YouTubeVideoGrid";

import { getPublicGalleryContent } from "@/lib/content/gallery";

import { GALLERY_ALBUMS, YOUTUBE_CHANNEL } from "@/lib/utils/constants";



export const metadata: Metadata = {

  title: "Gallery",

  description:

    "Photo albums and videos from Ramakrishna Mission Ashrama, Narayanpur — campus life, festivals, events and tribal welfare activities.",

};



export default async function GalleryPage() {

  const { photos, videos } = await getPublicGalleryContent();

  const videoIds = videos.map((v) => v.id);



  return (

    <>

      <PageHero

        eyebrow="Media"

        title="Gallery"

        description="Moments from campus life, festivals, conventions and welfare activities across Narayanpur and Abujhmarh."

      />



      <section className="section bg-white">

        <div className="container-site">

          <SectionHeader title="Photographs" className="mb-6 sm:mb-8" />



          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">

            {photos.map((p) => (

              <figure

                key={`${p.src}-${p.caption}`}

                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-blue-100 card-lift"

              >

                <Image

                  src={p.src}

                  alt={p.caption}

                  fill

                  className="object-cover group-hover:scale-105 transition-transform duration-500"

                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"

                />

                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0D2660]/95 via-[#0D2660]/50 to-transparent p-3 pt-10 sm:pt-8">

                  <span className="text-white text-xs sm:text-sm font-medium leading-snug block line-clamp-2">

                    {p.caption}

                  </span>

                  {p.year && (

                    <span className="text-[#F5C200] text-[10px] sm:text-xs font-semibold">{p.year}</span>

                  )}

                </figcaption>

              </figure>

            ))}

          </div>

        </div>

      </section>



      <section className="section section-alt">

        <div className="container-site">

          <SectionHeader title="More Albums on Google Photos" className="mb-6 sm:mb-8" />



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {GALLERY_ALBUMS.map((album) => (

              <a

                key={album.year}

                href={album.href}

                target="_blank"

                rel="noopener noreferrer"

                className="group block rounded-2xl overflow-hidden border border-blue-100 bg-white card-lift hover:border-[#0D2660]/30"

              >

                <div className="navy-gradient h-36 sm:h-40 flex flex-col items-center justify-center text-white relative">

                  <div className="gold-gradient h-1 absolute top-0 left-0 right-0" aria-hidden="true" />

                  <Images className="h-8 sm:h-10 w-8 sm:w-10 text-[#F5C200] mb-2" aria-hidden="true" />

                  <div className="text-2xl sm:text-3xl font-bold">{album.year}</div>

                </div>

                <div className="p-4 sm:p-5 flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <div className="font-bold text-[#0D2660] text-sm sm:text-base truncate">

                      Events &amp; Activities {album.year}

                    </div>

                    <div className="text-xs text-gray-500">{album.count} albums</div>

                  </div>

                  <span className="text-[#C8201A] inline-flex items-center gap-1 text-sm font-semibold shrink-0 group-hover:gap-2 transition-all">

                    View <ExternalLink className="h-3.5 w-3.5" />

                  </span>

                </div>

              </a>

            ))}

          </div>

          <p className="text-xs text-gray-400 mt-6">

            Photo albums are hosted on Google Photos and open in a new tab.

          </p>

        </div>

      </section>



      <section className="section bg-white">

        <div className="container-site">

          <SectionHeader title="Videos" className="mb-6 sm:mb-8" />

          <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed max-w-3xl">

            Documentaries, event coverage and student programmes from Ramakrishna Mission, Narayanpur.

            Click a thumbnail to play inline, or visit our YouTube channel for more.

          </p>



          <YouTubeVideoGrid videoIds={videoIds} />



          <div className="text-center mt-10">

            <a

              href={YOUTUBE_CHANNEL}

              target="_blank"

              rel="noopener noreferrer"

              className="inline-flex items-center justify-center gap-2 bg-[#C8201A] hover:bg-[#9B1812] text-white font-semibold rounded-md px-6 py-3 min-h-11 transition-colors"

            >

              <Play className="h-5 w-5" aria-hidden="true" /> Visit YouTube Channel

            </a>

          </div>

        </div>

      </section>

    </>

  );

}


