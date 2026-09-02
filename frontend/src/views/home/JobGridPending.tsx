import { Spinner } from "@/components/ui";

export default function JobGridPending() {
  return (
    <div
      role="status"
      className="mt-8 flex justify-center py-20 md:mt-11.25 lg:mt-20"
    >
      <Spinner className="text-accent size-12 border-4" />
      <span className="sr-only">Loading jobs</span>
    </div>
  );
}
