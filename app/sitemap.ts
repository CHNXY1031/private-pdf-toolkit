import type { MetadataRoute } from "next";
import { SITE_URL, toolPages } from "@/lib/toolPages";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...toolPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: ["merge-pdf-free", "split-pdf-online", "jpg-to-pdf-converter", "compress-pdf-no-upload"].includes(page.slug) ? 0.9 : 0.7,
    })),
  ];
}
