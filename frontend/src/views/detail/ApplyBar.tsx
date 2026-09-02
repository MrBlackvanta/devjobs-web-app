import { Signature } from "@/components/layout";
import type { JobDetail } from "@/types";
import ApplyLink from "./ApplyLink";

export default function ApplyBar({ job }: { job: JobDetail }) {
  return (
    <footer className="bg-surface relative mt-16 px-6 md:mt-20 md:px-10">
      <div className="max-w-detail mx-auto flex h-24 items-center justify-between">
        <div className="hidden md:block">
          <p className="text-h3 text-heading font-bold">{job.position}</p>
          <p className="mt-1.25">{job.company}</p>
        </div>

        <ApplyLink href={job.apply} className="w-full md:w-35.25" />
      </div>

      <Signature />
    </footer>
  );
}
