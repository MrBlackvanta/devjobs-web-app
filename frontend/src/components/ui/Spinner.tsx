export default function Spinner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`v-spinner ${className}`} />;
}
