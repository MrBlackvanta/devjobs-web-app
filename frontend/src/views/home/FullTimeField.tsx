import { CheckIcon } from "@/components/icons";

type FullTimeFieldProps = {
  className: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  name?: string;
};

export default function FullTimeField({
  className,
  checked,
  onChange,
  children,
  name,
}: FullTimeFieldProps) {
  return (
    <label className={className}>
      <input
        type="checkbox"
        name={name}
        value="true"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="border-control-edge bg-control rounded-check group-hover:border-violet peer-checked:border-violet peer-checked:bg-violet peer-focus-visible:outline-accent grid size-6 shrink-0 place-items-center border text-transparent peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
        <CheckIcon />
      </span>
      <span className="text-heading font-bold">{children}</span>
    </label>
  );
}
