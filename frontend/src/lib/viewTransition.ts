"use client";

import { flushSync } from "react-dom";

type Origin = { x: number; y: number };

function canAnimate() {
  return (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function clearSweep() {
  delete document.documentElement.dataset.sweep;
}

export function withThemeSweep(
  update: () => void,
  origin: Origin,
  closing: boolean,
) {
  if (!canAnimate()) {
    update();
    return;
  }

  const root = document.documentElement;
  const width = root.clientWidth;
  const height = root.clientHeight;
  const radius = Math.hypot(
    Math.max(origin.x, width - origin.x),
    Math.max(origin.y, height - origin.y),
  );

  root.style.setProperty("--sweep-x", `${(origin.x / width) * 100}%`);
  root.style.setProperty("--sweep-y", `${(origin.y / height) * 100}%`);
  root.style.setProperty(
    "--sweep-r",
    `${(radius / (Math.hypot(width, height) / Math.SQRT2)) * 100}%`,
  );
  root.dataset.sweep = closing ? "out" : "in";

  const transition = document.startViewTransition(() => flushSync(update));
  transition.ready.catch(clearSweep);
  transition.finished.then(clearSweep, clearSweep);
}
