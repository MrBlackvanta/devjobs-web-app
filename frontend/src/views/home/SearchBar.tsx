"use client";

import { FilterIcon, SearchIcon } from "@/components/icons";
import { Spinner } from "@/components/ui";
import { filtersToHref } from "@/lib";
import type { JobFilters } from "@/types";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useRef, useState, useTransition } from "react";
import FilterDialog from "./FilterDialog";
import FullTimeField from "./FullTimeField";
import LocationField from "./LocationField";

export default function SearchBar({ filters }: { filters: JobFilters }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(filters);
  const [draft, setDraft] = useState(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersTriggerRef = useRef<HTMLButtonElement>(null);

  if (
    applied.search !== filters.search ||
    applied.location !== filters.location ||
    applied.fullTime !== filters.fullTime
  ) {
    setApplied(filters);
    setDraft(filters);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFiltersOpen(false);
    startTransition(() => router.push(filtersToHref(draft), { scroll: false }));
  }

  return (
    <form
      action="/"
      role="search"
      aria-label="Filter jobs"
      onSubmit={handleSubmit}
      className="bg-surface rounded-card relative flex h-20"
    >
      <label className="flex flex-1 cursor-text items-center gap-4 pl-6 lg:pl-8">
        <span className="sr-only">Filter by title, companies, expertise</span>
        <SearchIcon className="text-violet hidden shrink-0 md:block" />
        <span className="relative flex h-full flex-1 items-center">
          <input
            id="job-search"
            name="search"
            type="text"
            enterKeyHint="search"
            placeholder=" "
            value={draft.search}
            onChange={(event) =>
              setDraft({ ...draft, search: event.target.value })
            }
            className="peer text-heading h-full w-full bg-transparent focus-visible:-outline-offset-2"
          />
          <span
            aria-hidden="true"
            className="text-placeholder pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 peer-placeholder-shown:block"
          >
            Filter by title
            <span className="xl:hidden">…</span>
            <span className="hidden xl:inline">, companies, expertise…</span>
          </span>
        </span>
      </label>

      <span className="bg-divider hidden w-px self-stretch md:block" />

      <LocationField
        className="hidden w-53.25 cursor-text items-center gap-4 pl-6 md:flex lg:w-75"
        name="location"
        value={draft.location}
        onChange={(location) => setDraft({ ...draft, location })}
      />

      <span className="bg-divider hidden w-px self-stretch md:block" />

      <div className="flex items-center gap-3 pr-4 md:w-63 md:justify-between md:pl-5 lg:w-86.25 lg:pl-8">
        <FullTimeField
          className="group hidden cursor-pointer items-center gap-4 md:flex"
          name="fullTime"
          checked={draft.fullTime}
          onChange={(fullTime) => setDraft({ ...draft, fullTime })}
        >
          Full Time<span className="hidden lg:inline"> Only</span>
        </FullTimeField>

        <button
          ref={filtersTriggerRef}
          type="button"
          aria-label="Filters"
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen(true)}
          className="text-dark-grey hover:text-violet p-3 md:hidden dark:text-white"
        >
          <FilterIcon />
        </button>

        <button
          type="submit"
          aria-busy={pending}
          className="group v-btn grid size-12 place-items-center md:h-12 md:w-20 lg:w-30.75"
        >
          <span className="col-start-1 row-start-1 flex items-center group-aria-busy:opacity-0">
            <SearchIcon className="size-5 md:hidden" />
            <span className="sr-only md:not-sr-only">Search</span>
          </span>
          {pending && (
            <Spinner className="col-start-1 row-start-1 size-5 border-2" />
          )}
        </button>
      </div>

      <FilterDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        triggerRef={filtersTriggerRef}
        draft={draft}
        onDraftChange={setDraft}
      />
    </form>
  );
}
