import type { JobFilters, SearchParams } from "@/types";

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

export function filtersToHref({ search, location, fullTime }: JobFilters) {
  const params = new URLSearchParams();

  if (search.trim()) params.set("search", search.trim());
  if (location.trim()) params.set("location", location.trim());
  if (fullTime) params.set("fullTime", "true");

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
