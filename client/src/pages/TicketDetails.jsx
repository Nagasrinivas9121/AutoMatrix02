import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AIReplyComposer from "../components/AIReplyComposer";
import MessageList from "../components/MessageList";
import api from "../api/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useUser } from "../context/UserContext";

// ---------------------------------------------------
// BADGE HELPERS
// ---------------------------------------------------
const statusBadge = (status = "") => {
  const normalized = status?.toLowerCase();

  const colors = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
  };

  const labelMap = {
    open: "Open",
    in_progress: "In Progress",
    closed: "Closed",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-sm font-medium ${
        colors[normalized] || "bg-gray-200 text-gray-700"
      }`}
    >
      {labelMap[normalized] || "Unknown"}
    </span>
  );
};

const priorityBadge = (priority = "") => {
  const normalized = priority?.toLowerCase();

  const colors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-sm font-medium ${
        colors[normalized] || "bg-gray-200 text-gray-700"
      }`}
    >
      {normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "N/A"}
    </span>
  );
};

// ---------------------------------------------------

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useUser();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // TRIAL + AI LIMIT LOGIC
  // ---------------------------------------------------
  const plan = user?.org?.plan || "trial";
  const trialEnds = user?.org?.trialEndsAt
    ? new Date(user.org.trialEndsAt)
    : null;

  const trialExpired =
    plan === "trial" && trialEnds && trialEnds.getTime() < Date.now();

  const aiUsed = user?.org?.aiReplyUsed || 0;
  const AI_LIMIT = 30;
  const aiLimitReached = plan === "trial" && aiUsed >= AI_LIMIT;

  // ---------------------------------------------------
  // FETCH TICKET (GUARD new)
  // ---------------------------------------------------
  useEffect(() => {
    if (id === "new") {
      setTicket(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/api/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------------------------------------------
  // STATES
  // ---------------------------------------------------
  if (id === "new") {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-slate-800 text-yellow-700 dark:text-yellow-300 rounded-xl">
        Creating a new ticket…
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner text="Loading ticket details..." />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl shadow">
        Ticket not found.
      </div>
    );
  }

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl animate-fadeIn">

      {/* LEFT PANEL */}
      <div className="lg:col-span-2 space-y-6">

        {/* HEADER */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {ticket.title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ticket ID: #{ticket.id}
          </p>

          <div className="flex items-center gap-3 mt-3">
            {statusBadge(ticket.status)}
            {priorityBadge(ticket.priority)}
          </div>
        </div>

        {/* CONVERSATION */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Conversation
          </h3>
          <MessageList ticketId={id} />
        </div>

        {/* AI COMPOSER */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-4">

          {trialExpired && (
            <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              Trial expired — upgrade to continue using AI replies.
            </div>
          )}

          {aiLimitReached && (
            <div className="mb-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
              AI reply limit reached ({AI_LIMIT} replies).
            </div>
          )}

          <AIReplyComposer
            ticketId={id}
            disabled={trialExpired || aiLimitReached}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 h-fit">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Ticket Details
        </h3>

        <div className="mt-4 space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Status:</span>
            {statusBadge(ticket.status)}
          </div>

          <div className="flex justify-between">
            <span>Priority:</span>
            {priorityBadge(ticket.priority)}
          </div>

          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{ticket.customerName || ticket.customerEmail || "Unknown"}</span>
          </div>

          <div className="flex justify-between">
            <span>Created:</span>
            <span>
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString()
                : "—"}
            </span>
          </div>

          {ticket.assignee && (
            <div className="flex justify-between">
              <span>Assigned To:</span>
              <span>{ticket.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}