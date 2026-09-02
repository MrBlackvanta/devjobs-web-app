import { LoadingPanel } from "@/components/ui";

export default function JobGridPending() {
  return (
    <LoadingPanel
      label="Loading jobs"
      className="mt-8 min-h-dvh md:mt-11.25 lg:mt-20"
    />
  );
}
