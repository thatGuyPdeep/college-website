import { adminClient as _adminClient } from "@/lib/supabase/admin";
import { GALLERY_PHOTOS } from "@/lib/utils/constants";
import { GALLERY_VIDEO_IDS } from "@/lib/content/gallery-videos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = _adminClient as any;

export type GalleryPhoto = { src: string; caption: string; year: string };
export type GalleryVideo = { id: string; title: string };

export async function getPublicGalleryContent(): Promise<{
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  fromDb: boolean;
}> {
  try {
    const { data, error } = await admin
      .from("gallery_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data ?? []) as {
      item_type: string;
      title: string;
      media_ref: string;
      year: string | null;
    }[];

    if (rows.length === 0) {
      return {
        photos: GALLERY_PHOTOS.map((p) => ({ src: p.src, caption: p.caption, year: p.year })),
        videos: GALLERY_VIDEO_IDS.map((id) => ({ id, title: "Mission video" })),
        fromDb: false,
      };
    }

    const photos = rows
      .filter((r) => r.item_type === "photo")
      .map((r) => ({
        src:     r.media_ref,
        caption: r.title,
        year:    r.year ?? "",
      }));

    const videos = rows
      .filter((r) => r.item_type === "video")
      .map((r) => ({ id: r.media_ref, title: r.title }));

    return {
      photos: photos.length ? photos : GALLERY_PHOTOS.map((p) => ({ src: p.src, caption: p.caption, year: p.year })),
      videos: videos.length ? videos : GALLERY_VIDEO_IDS.map((id) => ({ id, title: "Mission video" })),
      fromDb: true,
    };
  } catch {
    return {
      photos: GALLERY_PHOTOS.map((p) => ({ src: p.src, caption: p.caption, year: p.year })),
      videos: GALLERY_VIDEO_IDS.map((id) => ({ id, title: "Mission video" })),
      fromDb: false,
    };
  }
}
