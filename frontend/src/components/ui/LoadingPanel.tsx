import Spinner from "./Spinner";

type LoadingPanelProps = {
  label: string;
  className?: string;
};

export default function LoadingPanel({ label, className }: LoadingPanelProps) {
  return (
    <div
      role="status"
      className={`flex justify-center py-20 ${className ?? ""}`}
    >
      <Spinner className="text-accent size-12 border-4" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
