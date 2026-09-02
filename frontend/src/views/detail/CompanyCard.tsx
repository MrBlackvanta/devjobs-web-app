import { formatWebsite } from "@/lib";
import type { JobDetail } from "@/types";

export default function CompanyCard({ job }: { job: JobDetail }) {
  return (
    <div className="bg-surface rounded-card relative -mt-3.75 flex flex-col items-center px-6 pt-11.75 pb-8 md:-mt-10 md:min-h-35 md:flex-row md:items-center md:p-0 md:pr-10">
      <span
        style={{ backgroundColor: job.logoBackground }}
        className="rounded-tile md:rounded-l-card absolute -top-6.25 left-1/2 grid h-12.5 w-12.5 -translate-x-1/2 place-items-center md:static md:h-auto md:w-35 md:translate-x-0 md:self-stretch md:rounded-none"
      >
        <img src={job.logo} alt="" className="md:scale-200" />
      </span>

      <div className="text-center md:ml-10 md:text-left">
        <p className="text-h3 text-heading md:text-h2 font-bold">
          {job.company}
        </p>
        <p className="mt-1.5">{formatWebsite(job.website)}</p>
      </div>

      <a
        href={job.website}
        target="_blank"
        rel="noopener noreferrer"
        className="v-btn-tint mt-5.5 grid h-12 w-36.75 place-items-center md:mt-0 md:ml-auto"
      >
        Company Site
      </a>
    </div>
  );
}
