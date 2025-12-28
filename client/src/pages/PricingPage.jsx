import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

/**
 * Pricing tiers (single source of truth)
 */
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 499,
    features: ["1 Agent", "300 AI replies / month", "Ticketing", "CRM"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 1499,
    features: [
      "5 Agents",
      "2000 AI replies / month",
      "Priority Support",
      "Analytics",
    ],
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 4999,
    features: ["Unlimited Agents", "Unlimited AI replies", "SSO", "SLA"],
    highlight: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [billingMonthly, setBillingMonthly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const startTrial = (planId) => {
    setLoadingPlan(planId);
    toast.info("Redirecting to signup...");
    navigate(`/signup?plan=${planId}&trial=1`);
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN").format(amount);

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Pricing</h1>
        <p className="mt-2 text-slate-600">
          Start free. Upgrade only when you’re ready.
        </p>
      </header>

      {/* BILLING TOGGLE */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setBillingMonthly(true)}
            className={`px-4 py-1 rounded-full text-sm transition ${
              billingMonthly
                ? "bg-white shadow font-semibold"
                : "text-slate-500"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBillingMonthly(false)}
            className={`px-4 py-1 rounded-full text-sm transition ${
              !billingMonthly
                ? "bg-white shadow font-semibold"
                : "text-slate-500"
            }`}
          >
            Yearly <span className="text-green-600">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const yearlyPrice = Math.round(tier.priceMonthly * 12 * 0.8);
          const price = billingMonthly
            ? tier.priceMonthly
            : yearlyPrice;

          return (
            <div
              key={tier.id}
              className={`relative p-6 rounded-xl border bg-white transition hover:shadow-md
                ${
                  tier.highlight
                    ? "border-blue-600 shadow-blue-100"
                    : "border-slate-200"
                }`}
            >
              {tier.highlight && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {tier.name}
              </h3>

              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{formatPrice(price)}
                </span>
                <span className="text-sm text-slate-500">
                  /{billingMonthly ? "mo" : "yr"}
                </span>
              </div>

              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="text-slate-600 text-sm">
                    • {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => startTrial(tier.id)}
                disabled={loadingPlan === tier.id}
                className="mt-6 w-full px-4 py-2 rounded-lg bg-blue-600 text-white
                  hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loadingPlan === tier.id
                  ? "Starting..."
                  : "Start Free Trial"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}