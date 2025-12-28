import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  actionLabel = "Retry",
  icon = true,
  children,
}) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        animate-fadeIn
        bg-red-50 dark:bg-red-900/20
        border border-red-200 dark:border-red-700
        text-red-800 dark:text-red-200
        rounded-xl p-4 shadow-sm
      "
    >
      <div className="flex items-start gap-3">

        {/* Icon */}
        {icon && (
          <ExclamationTriangleIcon
            className="w-6 h-6 text-red-600 dark:text-red-300 shrink-0"
            aria-hidden="true"
          />
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="font-semibold text-sm md:text-base">
            {title}
          </div>

          {message && (
            <p className="text-sm mt-1 text-red-700 dark:text-red-300/80 leading-relaxed">
              {message}
            </p>
          )}

          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>

        {/* Retry / Action */}
        {onRetry && (
          <button
            onClick={onRetry}
            type="button"
            className="
              px-3 py-1.5 text-sm rounded-lg shrink-0
              bg-red-600 text-white
              hover:bg-red-700 transition
              dark:bg-red-700 dark:hover:bg-red-600
            "
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}