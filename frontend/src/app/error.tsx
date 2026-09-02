"use client";

import { SiteFooter } from "@/components/layout";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <>
      <main className="grow px-6 md:px-10">
        <div className="max-w-detail mx-auto mt-20 text-center">
          <h1 className="text-h2">Something went wrong</h1>
          <p className="mt-4">
            The job board could not be reached. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="v-btn mt-8 h-12 w-35.25"
          >
            Try Again
          </button>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
