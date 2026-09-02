"use client";

import { useSyncExternalStore } from "react";
import { themeStorageKey } from "./themeScript";

export type Theme = "light" | "dark";

const darkQuery = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  const stored = storage()?.getItem(themeStorageKey);

  return stored === "dark" || stored === "light" ? stored : null;
}

function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function serverTheme(): Theme {
  return "light";
}

function paint(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  const media = window.matchMedia(darkQuery);

  function followSystem() {
    if (!storedTheme()) paint(systemTheme());
  }

  function followOtherTabs(event: StorageEvent) {
    if (event.key === themeStorageKey) paint(storedTheme() ?? systemTheme());
  }

  listeners.add(notify);
  media.addEventListener("change", followSystem);
  window.addEventListener("storage", followOtherTabs);

  return () => {
    listeners.delete(notify);
    media.removeEventListener("change", followSystem);
    window.removeEventListener("storage", followOtherTabs);
  };
}

export function setTheme(theme: Theme) {
  storage()?.setItem(themeStorageKey, theme);
  paint(theme);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, currentTheme, serverTheme);
}
