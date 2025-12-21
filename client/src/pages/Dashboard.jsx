import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import api from "../api/api";

export default function Dashboard() {
  // ----------------------------------
  // USER + TRIAL CHECK
  // ----------------------------------
  const { user } = useUser();
  const plan = user?.org?.plan;
  const trialEnds = user?.org?.trialEndsAt
    ? new Date(user.org.trialEndsAt)
    : null;

  const trialExpired = plan === "trial" && trialEnds && trialEnds < new Date();

  if (trialExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="max-w-lg w-full p-8 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 rounded-2xl text-center shadow-sm">
          <h2 className="text-3xl font-bold text-red-600 mb-3">
            Trial Expired
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Your free trial has ended. Upgrade your plan to continue automating
            customer support.
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Upgrade Plan
          </a>
        </div>
      </div>
    );
  }

  // ----------------------------------
  // DASHBOARD STATE
  // ----------------------------------
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
  });

  // ----------------------------------
  // FETCH TICKETS
  // ----------------------------------
  useEffect(() => {
    api
      .get("/api/tickets")
      .then((res) => {
        const tickets = res.data || [];
        setStats({
          totalTickets: tickets.length,
          openTickets: tickets.filter(t => t.status === "open").length,
          closedTickets: tickets.filter(t => t.status === "closed").length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ----------------------------------
  // METRIC CARD
  // ----------------------------------
  const Card = ({ label, value }) => (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </div>
      {loading ? (
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded mt-3 animate-pulse" />
      ) : (
        <div className="text-4xl font-semibold mt-2 text-slate-900 dark:text-white">
          {value}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time overview of your customer support automation
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Total Tickets" value={stats.totalTickets} />
        <Card label="Open Tickets" value={stats.openTickets} />
        <Card label="Closed Tickets" value={stats.closedTickets} />
      </div>

      {/* AUTOMATION STATUS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
            Email Automation
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
            Live · AI replies are being sent automatically
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">
            WhatsApp Automation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Coming soon · Meta verification in progress
          </p>
        </div>
      </div>

      {/* ROADMAP NOTE */}
      <div className="mt-10 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300">
          What’s next 🚀
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Analytics, SLA tracking, agent performance, and WhatsApp automation are
          launching next.
        </p>
      </div>
    </div>
  );
}