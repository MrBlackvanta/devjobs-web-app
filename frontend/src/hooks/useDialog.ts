import { type RefObject, useEffect, useRef } from "react";

const desktopQuery = "(min-width: 48rem)";

function afterNextPaint(run: () => void) {
  let cancelled = false;

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (!cancelled) run();
    }),
  );

  return () => {
    cancelled = true;
  };
}

function lockScroll() {
  const offset = window.scrollY;
  const { body } = document;

  body.style.setProperty("--scroll-lock-top", `${-offset}px`);
  body.classList.add("v-scroll-lock");

  return () => {
    body.classList.remove("v-scroll-lock");
    body.style.removeProperty("--scroll-lock-top");
    window.scrollTo({ top: offset, behavior: "instant" });
  };
}

export function useDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  triggerRef: RefObject<HTMLButtonElement | null>,
) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const releaseScroll = lockScroll();
    const cancelFocus = afterNextPaint(() => panelRef.current?.focus());
    const desktop = window.matchMedia(desktopQuery);

    function focusables() {
      const selector = "input:not([disabled]), button:not([disabled])";
      return [
        ...(panelRef.current?.querySelectorAll<HTMLElement>(selector) ?? []),
      ];
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) return;

      const active = document.activeElement;
      const atStart = active === first || active === panelRef.current;

      if (event.shiftKey && atStart) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function closeOnDesktop() {
      if (desktop.matches) onOpenChange(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      cancelFocus();
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
      releaseScroll();
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onOpenChange, triggerRef]);

  return panelRef;
}
