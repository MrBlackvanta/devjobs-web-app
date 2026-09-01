import { parseFilters } from "@/lib";
import type { SearchParams } from "@/types";
import { SearchBar } from "@/views/home";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const filters = parseFilters(await searchParams);

  return (
    <main className="grow px-6 md:px-10">
      <h1 className="sr-only">Developer job listings</h1>
      <div className="max-w-page mx-auto -mt-10">
        <SearchBar filters={filters} />
      </div>
    </main>
  );
}
