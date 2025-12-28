import React from "react";

export default function LoadingSpinner({
  size = 8,        // numeric scale (multiplied internally)
  inline = false,  // inline vs centered
  text = "",
  className = "",
}) {
  const dim = size * 4; // Tailwind-safe px calculation

  return (
    <div
      className={`
        ${inline ? "inline-flex" : "flex"}
        items-center gap-3
        ${inline ? "" : "justify-center"}
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
    >
      {/* Spinner */}
      <svg
        style={{ width: dim, height: dim }}
        className="animate-spin text-indigo-600 dark:text-indigo-400"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="4"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Optional label */}
      {text && (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {text}
        </span>
      )}
    </div>
  );
}