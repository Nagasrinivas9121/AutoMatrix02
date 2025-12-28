// src/components/UpgradeModal.jsx
import React, { useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function UpgradeModal({ open, onClose, onChoose }) {
  if (!open) return null;

  const PLANS = [
    {
      id: "starter",
      name: "Starter",
      price: "₹499 / month",
      popular: false,
      features: ["1 Agent", "300 AI replies", "Ticketing", "CRM"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹1499 / month",
      popular: true,
      features: ["5 Agents", "2000 AI replies", "Priority Support", "Analytics"],
    },
    {
      id: "business",
      name: "Business",
      price: "₹4999 / month",
      popular: false,
      features: ["Unlimited Agents", "Unlimited AI replies", "SSO", "SLA"],
    },
  ];

  // Close on ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-xl bg-white dark:bg-slate-800
          rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700
          p-6 animate-scaleIn
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upgrade Your Plan
        </h3>
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
          Unlock full AI automation, analytics, priority support, and more.
        </p>

        {/* PLANS */}
        <div className="mt-6 space-y-5">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onChoose(plan.id)}
              className={`
                w-full text-left p-5 rounded-xl border transition
                hover:shadow-md hover:-translate-y-0.5
                ${
                  plan.popular
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{plan.name}</div>
                <div className="font-bold">{plan.price}</div>
              </div>

              {plan.popular && (
                <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full bg-black/20">
                  ⭐ Most Popular
                </span>
              )}

              <ul
                className={`mt-3 space-y-1 text-sm ${
                  plan.popular
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg border
              hover:bg-slate-100 dark:hover:bg-slate-700 transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}