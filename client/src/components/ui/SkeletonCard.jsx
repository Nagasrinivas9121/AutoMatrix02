// src/components/SkeletonCard.jsx
import React from "react";

export default function SkeletonCard({
  lines = 3,
  showHeader = true,
  showFooter = false,
  avatar = false,
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        rounded-xl p-5
        ${className}
      `}
      aria-busy="true"
      aria-live="polite"
    >
      {/* HEADER */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {avatar && (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
            )}
            <div className="h-5 w-36 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      )}

      {/* BODY */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`
              h-3 rounded bg-slate-200 dark:bg-slate-700
              ${i === lines - 1 ? "w-3/4" : "w-full"}
            `}
          />
        ))}
      </div>

      {/* FOOTER */}
      {showFooter && (
        <div className="mt-5 flex justify-end">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      )}
    </div>
  );
}