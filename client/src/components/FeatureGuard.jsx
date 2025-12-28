// src/components/FeatureGuard.jsx
import React from "react";
import { usePlan } from "../context/PlanContext";
import { Link } from "react-router-dom";

const PLAN_ORDER = {
  free: 0,
  trial: 1,
  starter: 2,
  pro: 3,
  business: 4,
};

export default function FeatureGuard({
  children,
  required = "pro",
  fallback = true,      // render upgrade UI or not
  onBlocked,
}) {
  const { org, loading } = usePlan();

  // While plan is loading, don't block or flash UI
  if (loading) return null;

  const currentPlan = org?.plan || "free";

  const currentLevel =
    PLAN_ORDER[currentPlan] ?? PLAN_ORDER.free;

  const requiredLevel =
    PLAN_ORDER[required] ?? PLAN_ORDER.pro;

  const allowed = currentLevel >= requiredLevel;

  if (allowed) return children;

  if (!fallback) return null;

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center">
      <div className="text-sm text-slate-700 dark:text-slate-300 mb-3">
        This feature is available on the{" "}
        <span className="font-semibold capitalize">{required}</span> plan and above.
      </div>

      <div className="flex justify-center gap-3">
        <Link
          to="/billing"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Upgrade
        </Link>

        {onBlocked && (
          <button
            onClick={onBlocked}
            className="px-4 py-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Contact Sales
          </button>
        )}
      </div>
    </div>
  );
}