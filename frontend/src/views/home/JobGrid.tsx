import { fetchJobs, filtersToHref } from "@/lib";
import type { JobFilters } from "@/types";
import JobCard from "./JobCard";
import LoadMore from "./LoadMore";

type JobGridProps = {
  filters: JobFilters;
  pages: number;
};

export default async function JobGrid({ filters, pages }: JobGridProps) {
  const { items, total, hasMore } = await fetchJobs(filters, pages);

  return (
    <div className="mt-8 md:mt-11.25 lg:mt-20">
      <p key={filtersToHref(filters)} role="status" className="sr-only">
        {total === 1 ? "1 job matches" : `${total} jobs match`} your search.
      </p>

      {items.length === 0 ? (
        <p className="text-heading text-center font-bold">
          No jobs match those filters. Try a broader search.
        </p>
      ) : (
        <ul className="grid gap-x-2.5 gap-y-6 md:grid-cols-2 md:gap-y-10 lg:grid-cols-3 lg:gap-x-7.5">
          {items.map((job) => (
            <li key={job.id} className="pt-6.25">
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && <LoadMore href={filtersToHref(filters, pages + 1)} />}
    </div>
  );
}
