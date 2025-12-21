import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function NotificationPanel({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div
      className="
        bg-white dark:bg-slate-800
        rounded-xl shadow-2xl
        border border-slate-200 dark:border-slate-700
        overflow-hidden
      "
      aria-live="polite"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Notifications
        </h3>

        {hasUnread && (
          <button
            onClick={onMarkAllRead}
            className="
              text-xs px-3 py-1 rounded-full
              bg-indigo-600 text-white
              hover:bg-indigo-700 transition
            "
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="max-h-80 overflow-auto divide-y dark:divide-slate-700">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`
                p-4 flex items-start gap-3 cursor-pointer transition
                hover:bg-slate-100 dark:hover:bg-slate-700
                ${!n.read ? "bg-indigo-50 dark:bg-slate-700/40" : ""}
              `}
            >
              {/* UNREAD DOT */}
              <div
                className={`
                  w-2 h-2 mt-2 rounded-full
                  ${n.read ? "bg-slate-400" : "bg-indigo-600"}
                `}
              />

              {/* CONTENT */}
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-slate-200">
                  {n.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {n.time}
                </p>
              </div>

              {/* MARK READ */}
              {!n.read && (
                <button
                  aria-label="Mark as read"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(n.id);
                  }}
                  className="
                    p-1 rounded
                    hover:bg-slate-200 dark:hover:bg-slate-600
                    transition
                  "
                >
                  <CheckIcon className="w-4 h-4 text-indigo-600" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}