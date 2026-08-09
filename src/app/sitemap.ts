import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://looptani.id";
  const locales = ["id", "en"];

  // Static core routes
  const staticRoutes = [
    "",
    "/marketplace",
    "/panduan-tani",
    "/jejak-lestari",
    "/loopi",
    "/about",
    "/limbah-analyzer",
    "/fertilizer-calculator",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/marketplace" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/marketplace" ? 0.9 : 0.8,
      });
    }
  }

  return entries;
}
