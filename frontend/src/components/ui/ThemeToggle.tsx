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
      <span className="relative h-6 w-12 rounded-full bg-white">
        <span className="bg-violet absolute top-1.25 left-1.25 size-3.5 translate-x-0 rounded-full transition-transform duration-200 ease-in-out dark:translate-x-6" />
      </span>
      <MoonIcon />
    </button>
  );
}
