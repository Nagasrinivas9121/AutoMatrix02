import React, { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New ticket received", time: "2m ago", unread: true },
    { id: 2, text: "AI reply generated", time: "10m ago", unread: false },
  ]);

  const bellRef = useRef(null);
  const panelRef = useRef(null);

  // ----------------------------------------
  // CLOSE ON OUTSIDE CLICK (FIXED)
  // ----------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (
        !panelRef.current?.contains(e.target) &&
        !bellRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ----------------------------------------
  // MARK ALL AS READ WHEN OPENED
  // ----------------------------------------
  useEffect(() => {
    if (open) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={bellRef}
        onClick={() => setOpen((s) => !s)}
        aria-label="Notifications"
        className="
          relative p-2 rounded-lg 
          hover:bg-slate-200 dark:hover:bg-slate-700 
          transition
        "
      >
        <BellIcon className="w-6 h-6 text-gray-700 dark:text-white" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={panelRef}
          className="
            absolute right-0 mt-3 w-72 
            bg-white dark:bg-slate-800 
            shadow-xl rounded-xl 
            border border-slate-200 dark:border-slate-700 
            animate-fadeIn z-40
          "
        >
          <div className="p-3 border-b dark:border-slate-700 font-semibold">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              No notifications
            </div>
          ) : (
            <div className="max-h-80 overflow-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="
                    p-3 border-b dark:border-slate-700 
                    hover:bg-slate-100 dark:hover:bg-slate-700 
                    transition cursor-pointer
                  "
                >
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-slate-500">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}