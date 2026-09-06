import { LocationIcon } from "@/components/icons";

type LocationFieldProps = {
  className: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
};

export default function LocationField({
  className,
  value,
  onChange,
  name,
}: LocationFieldProps) {
  return (
    <label className={className}>
      <span className="sr-only">Filter by location</span>
      <LocationIcon className="text-violet shrink-0" />
      <span className="relative -ml-2 flex h-full flex-1 items-center">
        <input
          name={name}
          type="text"
          enterKeyHint="search"
          placeholder=" "
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="peer text-heading h-full w-full bg-transparent px-2 focus-visible:-outline-offset-2"
        />
        <span
          aria-hidden="true"
          className="text-placeholder pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 peer-placeholder-shown:block"
        >
          Filter by location…
        </span>
      </span>
    </label>
  );
}
