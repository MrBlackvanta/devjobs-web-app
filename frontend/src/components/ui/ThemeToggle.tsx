"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { withThemeSweep } from "@/lib";
import { useTheme } from "next-themes";
import type { MouseEvent } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const origin = { x: left + width / 2, y: top + height / 2 };

    withThemeSweep(() => setTheme(isDark ? "light" : "dark"), origin, !isDark);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      className="v-band-focus flex items-center gap-4 py-2.5 text-white"
    >
      <span className="sr-only">Dark mode</span>
      <SunIcon />
      <span className="flex w-12 rounded-full bg-white p-1.25">
        <span className="bg-violet size-3.5 translate-x-0 rounded-full motion-safe:transition-transform dark:translate-x-6" />
      </span>
      <MoonIcon />
    </button>
  );
}
