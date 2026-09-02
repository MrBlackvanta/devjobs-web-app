import { siteUrl } from "@/data";
import { fetchJobs, maxPages, parseFilters } from "@/lib";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await fetchJobs(parseFilters({}), maxPages);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    ...items.map((job) => ({
      url: `${siteUrl}/jobs/${job.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
