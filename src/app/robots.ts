import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://looptani.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/seller/",
          "/admin/",
          "/checkout",
          "/profile/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
