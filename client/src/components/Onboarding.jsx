import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [dismissed, setDismissed] = useState(false);

  // Guard: do not render if not needed
  if (
    dismissed ||
    !user?.org ||
    user.org.onboardingCompleted
  ) {
    return null;
  }

  // (Future-ready) – replace with real flags later
  const steps = [
    { label: "Create your first ticket", done: false, action: "/app/tickets/new" },
    { label: "Add your first customer", done: false, action: "/app/customers" },
    { label: "Enable AI Auto Reply", done: false, action: "/app/settings" },
  ];

  const nextStep = steps.find((s) => !s.done);

  return (
    <div
      className="
        fixed bottom-4 right-4 z-50
        bg-white dark:bg-slate-800
        p-5 w-80
        rounded-xl shadow-2xl
        border border-slate-200 dark:border-slate-700
        animate-fadeIn
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          🎉 Welcome to Automatrixx
        </h3>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Dismiss onboarding"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Let’s complete your setup in a few quick steps:
      </p>

      {/* Steps */}
      <ul className="space-y-2 text-sm mb-4">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className={step.done ? "text-green-600" : "text-slate-400"}>
              {step.done ? "✔" : "○"}
            </span>
            <span
              className={
                step.done
                  ? "line-through text-slate-400"
                  : "text-slate-700 dark:text-slate-200"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {nextStep && (
        <button
          onClick={() => navigate(nextStep.action)}
          className="
            w-full bg-indigo-600 text-white
            py-2 rounded-lg
            hover:bg-indigo-700 transition
          "
        >
          Start Setup →
        </button>
      )}
    </div>
  );
}