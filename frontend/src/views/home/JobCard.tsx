import { formatPostedAt } from "@/lib";
import type { JobSummary } from "@/types";
import Link from "next/link";

export default function JobCard({ job }: { job: JobSummary }) {
  return (
    <article className="bg-surface rounded-card has-[a:focus-visible]:outline-accent group relative flex h-full min-h-57 flex-col px-8 pt-11 pb-8.5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2">
      <span
        style={{ backgroundColor: job.logoBackground }}
        className="rounded-tile absolute -top-6.25 left-8 grid size-12.5 place-items-center"
      >
        <img src={job.logo} alt="" />
      </span>

      <p className="flex items-center gap-3">
        <time dateTime={job.postedAt}>{formatPostedAt(job.postedAt)}</time>
        <span className="size-1 shrink-0 translate-y-0.5 rounded-full bg-current" />
        {job.contract}
      </p>

      <h2 className="text-h3 mt-2.25">
        <Link
          href={`/jobs/${job.id}`}
          className="group-hover:text-muted after:absolute after:inset-0 focus-visible:outline-hidden"
        >
          {job.position}
        </Link>
      </h2>

      <p className="mt-2.5">{job.company}</p>

      <p className="text-accent text-label mt-auto font-bold">{job.location}</p>
    </article>
  );
}
