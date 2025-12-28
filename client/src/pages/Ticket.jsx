import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TicketCard from "../components/TicketCard";
import api from "../api/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useUser } from "../context/UserContext";

export default function Tickets() {
  const { user } = useUser();

  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // -----------------------------
  // TRIAL / PLAN LOGIC
  // -----------------------------
  const plan = user?.org?.plan || "trial";
  const trialEnds = user?.org?.trialEndsAt
    ? new Date(user.org.trialEndsAt)
    : null;

  const isTrial = plan === "trial";
  const trialExpired =
    isTrial && trialEnds && trialEnds.getTime() < Date.now();

  const TICKET_LIMIT = 100;
  const limitReached = isTrial && tickets.length >= TICKET_LIMIT;

  if (trialExpired) {
    return (
      <div className="p-8 mt-10 text-center bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-300 dark:border-red-700">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
          Trial Expired
        </h2>
        <p className="mt-2 text-red-700 dark:text-red-300">
          Upgrade your plan to continue managing tickets.
        </p>
        <Link
          to="/pricing"
          className="mt-4 inline-block px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Upgrade Now
        </Link>
      </div>
    );
  }

  // -----------------------------
  // FETCH TICKETS
  // -----------------------------
  useEffect(() => {
    api
      .get("/api/tickets")
      .then((res) => {
        const data = res.data || [];
        setTickets(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to fetch tickets:", err))
      .finally(() => setLoading(false));
  }, []);

  // -----------------------------
  // FILTER + SORT
  // -----------------------------
  useEffect(() => {
    let data = [...tickets];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((t) =>
        t.title?.toLowerCase().includes(q)
      );
    }

    if (status !== "all") {
      data = data.filter(
        (t) => t.status?.toLowerCase() === status
      );
    }

    if (priority !== "all") {
      data = data.filter(
        (t) => t.priority?.toLowerCase() === priority
      );
    }

    if (sort === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "oldest") {
      data.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    if (sort === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      data.sort(
        (a, b) =>
          (order[a.priority] || 99) -
          (order[b.priority] || 99)
      );
    }

    setFiltered(data);
  }, [tickets, status, priority, search, sort]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-6 rounded-xl animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Tickets
        </h1>

        {limitReached ? (
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
          >
            + New Ticket
          </button>
        ) : (
          <Link
            to="/app/tickets/new"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            + New Ticket
          </Link>
        )}
      </div>

      {limitReached && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-lg text-sm">
          Trial limit reached — max {TICKET_LIMIT} tickets.
          <Link to="/pricing" className="underline ml-1">
            Upgrade
          </Link>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-800 border p-4 rounded-xl shadow-sm flex flex-wrap gap-4 mb-6">

        {/* STATUS */}
        {[
          { label: "All", value: "all" },
          { label: "Open", value: "open" },
          { label: "In Progress", value: "in_progress" },
          { label: "Closed", value: "closed" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              status === s.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {s.label}
          </button>
        ))}

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search tickets..."
          className="flex-1 min-w-[200px] p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* PRIORITY */}
        <select
          className="p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* SORT */}
        <select
          className="p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority (High → Low)</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner text="Loading Tickets..." />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((t, i) => (
            <div
              key={t.id}
              className="animate-slideUp"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <TicketCard ticket={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-16 text-gray-500 dark:text-gray-400 text-lg">
          No tickets found.
          {!limitReached && (
            <Link
              to="/app/tickets/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Create Ticket
            </Link>
          )}
        </div>
      )}
    </div>
  );
}