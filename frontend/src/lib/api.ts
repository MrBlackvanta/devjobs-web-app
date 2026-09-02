import { apiUrl } from "@/data";
import type { JobFilters, JobSummary, PagedResult } from "@/types";
import { jobsPerPage } from "./filters";

export async function fetchJobs(filters: JobFilters, pages: number) {
  const query = new URLSearchParams({
    pageSize: String(jobsPerPage * pages),
  });

  if (filters.search) query.set("search", filters.search);
  if (filters.location) query.set("location", filters.location);
  if (filters.fullTime) query.set("fullTime", "true");

  const response = await fetch(`${apiUrl}/jobs?${query}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Job search failed with status ${response.status}`);
  }

  return (await response.json()) as PagedResult<JobSummary>;
}
