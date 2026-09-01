"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={resolvedTheme === "dark"}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
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
