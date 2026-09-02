import { fetchJob, pageMetadata } from "@/lib";
import { ApplyBar, CompanyCard, JobPosting } from "@/views/detail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type JobPageProps = {
  params: Promise<{ id: string }>;
};

function describe(
  position: string,
  company: string,
  contract: string,
  location: string,
) {
  return `${company} is hiring a ${position} on a ${contract.toLowerCase()} contract in ${location}. Read the full brief and apply.`;
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const job = await fetchJob((await params).id);

  if (!job) return { title: "Job not found" };

  const title = `${job.position} at ${job.company}`;

  return pageMetadata({
    title,
    shareTitle: title,
    description: describe(
      job.position,
      job.company,
      job.contract,
      job.location,
    ),
    path: `/jobs/${job.id}`,
  });
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await fetchJob((await params).id);

  if (!job) notFound();

  return (
    <>
      <main className="grow px-6 md:px-10">
        <article className="max-w-detail mx-auto">
          <CompanyCard job={job} />
          <JobPosting job={job} />
        </article>
      </main>

      <ApplyBar job={job} />
    </>
  );
}
