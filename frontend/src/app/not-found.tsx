import { SiteFooter } from "@/components/layout";
import Link from "next/link";

export const metadata = {
  title: "Job not found",
};

export default function NotFound() {
  return (
    <>
      <main className="grow px-6 md:px-10">
        <div className="max-w-detail mx-auto mt-20 text-center">
          <h1 className="text-h2">This posting is no longer listed</h1>
          <p className="mt-4">
            It may have been filled or taken down. Browse the roles that are
            still open.
          </p>
          <Link
            href="/"
            className="v-btn mx-auto mt-8 grid h-12 w-35.25 place-items-center"
          >
            All Jobs
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
