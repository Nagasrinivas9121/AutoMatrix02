import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Toast({
  id,
  type = "info",
  title,
  message,
  onClose,
}) {
  const colorClasses = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warn: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const cls = colorClasses[type] || colorClasses.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        max-w-md w-full p-4 rounded-lg border shadow-sm 
        flex items-start gap-3 animate-slideIn
        ${cls}
      `}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold text-sm leading-tight">
            {title}
          </div>
        )}

        {message && (
          <div className="text-sm mt-1 leading-relaxed">
            {message}
          </div>
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={() => onClose?.(id)}
        aria-label="Dismiss notification"
        className="
          p-1 rounded 
          hover:bg-black/5 dark:hover:bg-white/10 
          transition
        "
      >
        <XMarkIcon className="w-5 h-5 opacity-60" />
      </button>
    </div>
  );
}