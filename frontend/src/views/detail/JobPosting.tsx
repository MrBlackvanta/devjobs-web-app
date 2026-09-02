import { formatPostedAt } from "@/lib";
import type { JobDetail } from "@/types";
import ApplyLink from "./ApplyLink";
import RequirementList from "./RequirementList";
import RoleList from "./RoleList";

export default function JobPosting({ job }: { job: JobDetail }) {
  return (
    <div className="bg-surface rounded-card mt-6 px-6 pt-8.75 pb-10 md:mt-8 md:px-12 md:pt-10.75 md:pb-12">
      <div className="md:flex md:items-start md:justify-between">
        <div>
          <p className="flex items-center gap-3">
            <time dateTime={job.postedAt}>{formatPostedAt(job.postedAt)}</time>
            <span className="size-1 shrink-0 translate-y-0.5 rounded-full bg-current" />
            {job.contract}
          </p>

          <h1 className="text-h3 md:text-h1 mt-1 md:mt-0.75">{job.position}</h1>

          <p className="text-accent text-label mt-2 font-bold md:mt-2.25">
            {job.location}
          </p>
        </div>

        <ApplyLink
          href={job.apply}
          className="mt-13 w-full md:mt-6.25 md:w-35.25 md:shrink-0"
        />
      </div>

      <p className="mt-8 md:mt-10.5">{job.description}</p>

      <h2 className="text-h3 mt-9.5">Requirements</h2>
      <p className="mt-6.5">{job.requirements.content}</p>
      <RequirementList items={job.requirements.items} />

      <h2 className="text-h3 mt-9.5">What You Will Do</h2>
      <p className="mt-6.5">{job.role.content}</p>
      <RoleList items={job.role.items} />
    </div>
  );
}
