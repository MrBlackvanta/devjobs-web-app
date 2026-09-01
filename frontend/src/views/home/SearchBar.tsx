"use client";

import {
  CheckIcon,
  FilterIcon,
  LocationIcon,
  SearchIcon,
} from "@/components/icons";
import { filtersToHref } from "@/lib";
import type { JobFilters } from "@/types";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState, useTransition } from "react";

export default function SearchBar({ filters }: { filters: JobFilters }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(filters);
  const [draft, setDraft] = useState(filters);

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
    startTransition(() => router.push(filtersToHref(draft), { scroll: false }));
  }

  return (
    <form
      action="/"
      role="search"
      aria-label="Filter jobs"
      aria-busy={pending}
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

      <label className="hidden w-53.25 cursor-text items-center gap-4 pl-6 md:flex lg:w-75">
        <span className="sr-only">Filter by location</span>
        <LocationIcon className="text-violet shrink-0" />
        <span className="relative flex h-full flex-1 items-center">
          <input
            id="job-location"
            name="location"
            type="text"
            enterKeyHint="search"
            placeholder=" "
            value={draft.location}
            onChange={(event) =>
              setDraft({ ...draft, location: event.target.value })
            }
            className="peer text-heading h-full w-full bg-transparent focus-visible:-outline-offset-2"
          />
          <span
            aria-hidden="true"
            className="text-placeholder pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 peer-placeholder-shown:block"
          >
            Filter by location…
          </span>
        </span>
      </label>

      <span className="bg-divider hidden w-px self-stretch md:block" />

      <div className="flex items-center gap-3 pr-4 md:w-63 md:justify-between md:pl-5 lg:w-86.25 lg:pl-8">
        <label className="group hidden cursor-pointer items-center gap-4 md:flex">
          <input
            type="checkbox"
            name="fullTime"
            value="true"
            checked={draft.fullTime}
            onChange={(event) =>
              setDraft({ ...draft, fullTime: event.target.checked })
            }
            className="peer sr-only"
          />
          <span className="border-control-edge bg-control rounded-check group-hover:border-violet peer-checked:border-violet peer-checked:bg-violet peer-focus-visible:outline-accent grid size-6 place-items-center border text-transparent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
            <CheckIcon />
          </span>
          <span className="text-heading font-bold">
            Full Time<span className="hidden lg:inline"> Only</span>
          </span>
        </label>

        <button
          type="button"
          aria-label="Filters"
          className="text-dark-grey hover:text-violet p-3 md:hidden dark:text-white"
        >
          <FilterIcon />
        </button>

        <button
          type="submit"
          className="bg-violet rounded-button hover:bg-violet-deep grid size-12 place-items-center font-bold text-white md:h-12 md:w-20 lg:w-30.75"
        >
          <SearchIcon className="size-5 md:hidden" />
          <span className="sr-only md:not-sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}
