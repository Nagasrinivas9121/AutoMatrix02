import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";

export default function TicketCard({ ticket }) {
  const formatDate = (value) => {
    if (!value) return "Unknown date";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "Unknown date" : d.toLocaleString();
  };

  const normalizeStatus = (status = "") =>
    status.toLowerCase().replace("_", " ");

  const getStatusBadge = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case "open":
        return "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700";
      case "closed":
        return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getPriorityBadge = (priority = "low") => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700";
    }
  };

  return (
    <Link
      to={`/app/tickets/${ticket.id}`}
      className="
        block rounded-xl bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        p-5 shadow-sm transition
        hover:shadow-md hover:-translate-y-0.5
      "
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between">

        {/* LEFT */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 truncate">
            {ticket.title || "Untitled Ticket"}
          </h3>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {ticket.description || "No description provided."}
          </p>

          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(ticket.priority)}`}
            >
              {ticket.priority || "low"}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(ticket.status)}`}
          >
            {normalizeStatus(ticket.status) || "unknown"}
          </span>

          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <ClockIcon className="w-3.5 h-3.5" />
            {formatDate(ticket.createdAt)}
          </div>
        </div>

      </div>
    </Link>
  );
}