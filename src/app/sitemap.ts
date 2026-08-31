import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://championhairsalon.com";

  const routes = [
    "",
    "/services",
    "/about",
    "/gallery",
    "/reviews",
    "/contact",
    "/book",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/book" || route === "/services" ? 0.9 : 0.7,
  }));

  return routes;
}
