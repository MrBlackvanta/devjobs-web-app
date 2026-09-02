import { parseFilters, parsePages } from "@/lib";
import type { SearchParams } from "@/types";
import { JobGrid, JobGridPending, SearchBar } from "@/views/home";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const pages = parsePages(params);

  return (
    <main className="grow px-6 md:px-10">
      <h1 className="sr-only">Developer job listings</h1>
      <div className="max-w-page mx-auto -mt-10">
        <SearchBar filters={filters} />
        <Suspense fallback={<JobGridPending />}>
          <JobGrid filters={filters} pages={pages} />
        </Suspense>
      </div>
    </main>
  );
}
