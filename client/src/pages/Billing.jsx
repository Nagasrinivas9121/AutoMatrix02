import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../api/api";
import useToast from "../hooks/useToast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBKEY);

export default function Billing() {
  const toast = useToast();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleCheckout = async (planId) => {
    if (loadingPlan) return;

    setLoadingPlan(planId);

    try {
      const res = await api.post("/billing/create-checkout-session", {
        planId,
        successUrl: `${window.location.origin}/billing?status=success`,
        cancelUrl: `${window.location.origin}/billing?status=cancel`,
      });

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Unable to start checkout. Please try again.");
      setLoadingPlan(null);
    }
  };

  const PlanCard = ({
    id,
    name,
    price,
    highlight,
    children,
    buttonStyle,
  }) => (
    <div
      className={`p-6 rounded-xl border ${
        highlight
          ? "bg-indigo-600 text-white border-indigo-600 scale-[1.02]"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <h3 className="text-xl font-bold">{name}</h3>
      <p className={`mt-1 ${highlight ? "text-indigo-100" : "text-slate-600 dark:text-slate-300"}`}>
        {price}
      </p>

      <ul className={`mt-4 space-y-2 text-sm ${highlight ? "text-indigo-100" : "text-slate-600 dark:text-slate-300"}`}>
        {children}
      </ul>

      <button
        disabled={loadingPlan === id}
        onClick={() => handleCheckout(id)}
        className={`mt-6 w-full px-4 py-2 rounded-lg font-medium transition ${
          highlight
            ? "bg-white text-indigo-600 hover:bg-indigo-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-60`}
      >
        {loadingPlan === id ? "Redirecting..." : "Upgrade"}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Upgrade your plan to unlock more AI power and automation.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* STARTER */}
        <PlanCard id="starter" name="Starter" price="₹499 / month">
          <li>• 1 Agent</li>
          <li>• 300 AI replies / month</li>
          <li>• Email support</li>
        </PlanCard>

        {/* PRO */}
        <PlanCard
          id="pro"
          name="Pro"
          price="₹1499 / month"
          highlight
        >
          <li>• 5 Agents</li>
          <li>• 2000 AI replies / month</li>
          <li>• Analytics & insights</li>
          <li>• Priority support</li>
        </PlanCard>

        {/* BUSINESS */}
        <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold">Business</h3>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Custom pricing
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Unlimited agents</li>
            <li>• Unlimited AI replies</li>
            <li>• SLA & White-label</li>
          </ul>

          <a
            href="/contact"
            className="mt-6 inline-block w-full text-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}