"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export type Theme = "dark" | "light";

const THEME_EVENT = "champion-theme-change";

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "dark");
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.localStorage.setItem("champion-theme", theme);

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === "dark" ? "#050505" : "#fbf8f1");
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeInitializer() {
  useLayoutEffect(() => {
    const savedTheme = window.localStorage.getItem("champion-theme");
    const theme: Theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    applyTheme(theme);
  }, []);

  return null;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(nextTheme)}
      className="theme-toggle premium-icon-button"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="relative block h-4 w-4" aria-hidden="true">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </span>
      {!compact && <span className="sr-only">Use {nextTheme} theme</span>}
    </button>
  );
}
