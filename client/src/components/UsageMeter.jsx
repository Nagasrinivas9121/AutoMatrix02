// src/components/UsageMeter.jsx
import React from "react";

export default function UsageMeter({ used = 0, limit = 1000 }) {
  const safeLimit = Math.max(limit, 1);
  const pct = Math.min(100, Math.round((used / safeLimit) * 100));

  const barColor =
    pct >= 90
      ? "bg-red-600"
      : pct >= 70
      ? "bg-yellow-500"
      : "bg-indigo-600";

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      
      {/* Header */}
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-slate-300">
          AI Replies Used
        </span>
        <span className="text-gray-600 dark:text-slate-400">
          {used} / {limit}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
      >
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Warning */}
      {pct >= 80 && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          ⚠ You are nearing your AI reply limit
        </p>
      )}
    </div>
  );
}