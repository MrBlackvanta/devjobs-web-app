import { useDialog } from "@/hooks";
import type { JobFilters } from "@/types";
import type { RefObject } from "react";
import FullTimeField from "./FullTimeField";
import LocationField from "./LocationField";

type FilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  draft: JobFilters;
  onDraftChange: (draft: JobFilters) => void;
};

export default function FilterDialog({
  open,
  onOpenChange,
  triggerRef,
  draft,
  onDraftChange,
}: FilterDialogProps) {
  const panelRef = useDialog(open, onOpenChange, triggerRef);

  return (
    <div
      inert={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      className={`bg-scrim fixed inset-0 z-50 flex items-center justify-center px-6 transition-[opacity,visibility] duration-300 motion-reduce:transition-none md:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabIndex={-1}
        className="bg-surface rounded-card w-full"
      >
        <LocationField
          className="flex h-18 cursor-text items-center gap-4 px-6"
          value={draft.location}
          onChange={(location) => onDraftChange({ ...draft, location })}
        />
        <span className="bg-divider block h-px" />
        <div className="flex flex-col gap-6 p-6">
          <FullTimeField
            className="group flex h-6 cursor-pointer items-center gap-4"
            checked={draft.fullTime}
            onChange={(fullTime) => onDraftChange({ ...draft, fullTime })}
          >
            Full Time Only
          </FullTimeField>
          <button type="submit" className="v-btn h-12 w-full">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
