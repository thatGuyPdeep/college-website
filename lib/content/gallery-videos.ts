/** YouTube videos from Obsidian media-videos.md capture */

export const GALLERY_VIDEO_IDS = [
  "1ylaFCSEWCc",
  "4wkdFK-gW84",
  "5AeGqB46D0A",
  "bPLIMM0S6Uw",
  "c6FtLf3rR6Y",
  "dkElqS6lITA",
  "dtvf2QhaSNE",
  "HABPVhyf8Ak",
  "HBB4VKd42Uk",
  "je6yuUDwGCM",
  "lrhOq8RhPQc",
  "S_xpEI92sH0",
] as const;

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function youtubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
