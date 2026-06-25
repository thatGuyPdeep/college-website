import type { MetadataRoute } from "next";
import { SITE_FULL_NAME, SITE_SHORT_NAME, SITE_TAGLINE_EN } from "@/lib/utils/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             `${SITE_FULL_NAME}, Narayanpur`,
    short_name:       SITE_SHORT_NAME,
    description:      SITE_TAGLINE_EN,
    start_url:        "/",
    display:          "standalone",
    background_color: "#FFFDF9",
    theme_color:      "#0D2660",
    icons: [
      {
        src:   "/rkm-logo.png",
        sizes: "512x512",
        type:  "image/png",
      },
    ],
  };
}
