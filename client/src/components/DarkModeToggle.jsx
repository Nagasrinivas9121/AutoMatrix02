import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return false;

    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Sync with system theme if user never selected manually
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setIsDark(e.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={() => setIsDark((v) => !v)}
      className="
        relative w-12 h-6 flex items-center
        bg-slate-300 dark:bg-slate-700
        rounded-full p-1 transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      <span
        className={`
          w-4 h-4 rounded-full shadow-md
          transform transition-transform duration-300
          ${isDark ? "translate-x-6 bg-slate-200" : "translate-x-0 bg-white"}
        `}
      />
    </button>
  );
}