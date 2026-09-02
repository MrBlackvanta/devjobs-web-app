import { apiUrl } from "@/data";
import type { JobDetail, JobFilters, JobSummary, PagedResult } from "@/types";
import { jobsPerPage } from "./filters";

const jobCacheSeconds = 60 * 60;

export async function fetchJobs(filters: JobFilters, pages: number) {
  const query = new URLSearchParams({
    pageSize: String(jobsPerPage * pages),
  });

  if (filters.search) query.set("search", filters.search);
  if (filters.location) query.set("location", filters.location);
  if (filters.fullTime) query.set("fullTime", "true");

  const response = await fetch(`${apiUrl}/jobs?${query}`, {
    next: { revalidate: jobCacheSeconds },
  });

  if (!response.ok) {
    throw new Error(`Job search failed with status ${response.status}`);
  }

  return (await response.json()) as PagedResult<JobSummary>;
}

export async function fetchJob(id: string) {
  if (!/^\d+$/.test(id)) return null;

  const response = await fetch(`${apiUrl}/jobs/${id}`, {
    next: { revalidate: jobCacheSeconds },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Job lookup failed with status ${response.status}`);
  }

  return (await response.json()) as JobDetail;
}
