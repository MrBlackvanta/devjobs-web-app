import type { JobFilters, SearchParams } from "@/types";

const apiMaxPageSize = 50;

export const jobsPerPage = 12;
export const maxPages = Math.floor(apiMaxPageSize / jobsPerPage);

function firstValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseFilters(params: SearchParams): JobFilters {
  return {
    search: firstValue(params.search),
    location: firstValue(params.location),
    fullTime: firstValue(params.fullTime) === "true",
  };
}

export function parsePages(params: SearchParams) {
  const requested = Number(firstValue(params.page));

  if (!Number.isInteger(requested)) return 1;

  return Math.min(Math.max(requested, 1), maxPages);
}

export function filtersToHref(
  { search, location, fullTime }: JobFilters,
  pages = 1,
) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (location.trim()) params.set("location", location.trim());
  if (fullTime) params.set("fullTime", "true");
  if (pages > 1) params.set("page", String(pages));

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
