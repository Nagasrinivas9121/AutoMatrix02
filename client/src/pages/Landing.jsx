import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import hero from "../assets/hero.png";

export default function Landing() {
  const [monthly, setMonthly] = useState(true);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 499,
      desc: "For solo founders & freelancers",
      features: [
        "1 agent",
        "300 AI replies / month",
        "Email + WhatsApp AI",
        "Ticket dashboard",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 1499,
      highlight: true,
      desc: "Best for growing teams",
      features: [
        "5 agents",
        "2000 AI replies / month",
        "Analytics",
        "Priority support",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 4999,
      desc: "For scaling businesses",
      features: [
        "Unlimited agents",
        "Unlimited AI replies",
        "SLA + White-label",
        "Dedicated support",
      ],
    },
  ];

  const calcPrice = (p) => (monthly ? p : Math.round(p * 12 * 0.8));

  return (
    <div className="bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Automatrixx AI logo" className="w-8 h-8" />
            <span className="font-bold text-lg">Automatrixx AI</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-slate-300">
            <a href="#features">Features</a>
            <a href="#whatsapp">WhatsApp AI</a>
            <a href="#pricing">Pricing</a>
          </div>
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            AI-Powered Customer Support
            <span className="text-indigo-500"> Without Hiring Agents</span>
          </h1>

          <p className="mt-6 text-lg text-slate-300">
            Replace human support with AI that replies instantly on
            <b> WhatsApp & Email — 24/7.</b>
          </p>

          <p className="mt-3 text-sm text-slate-400">
            ⚡ Setup in under 10 minutes · No humans required
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-indigo-600 rounded-lg font-semibold"
            >
              Start Free Trial
            </Link>
            <span className="px-4 py-3 bg-slate-800 rounded-lg text-sm">
              No credit card required
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
          <img
            src={hero}
            alt="Automatrixx AI dashboard preview"
            className="rounded-xl"
          />
        </div>
      </section>

      {/* BUILT FOR */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Built For</h2>
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            {["E-commerce", "SaaS", "Startups", "Service Businesses"].map((i) => (
              <div key={i} className="p-6 bg-slate-800 rounded-xl">
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP AI */}
      <section id="whatsapp" className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">WhatsApp AI Auto-Reply</h2>
          <p className="mt-4 text-slate-300">
            🚫 No agents · No shifts · No missed messages
          </p>

          <div className="mt-10 grid md:grid-cols-4 gap-6 text-sm">
            {[
              "Instant auto-replies",
              "AI understands intent",
              "Chats → Tickets",
              "Escalation only if needed",
            ].map((f) => (
              <div key={f} className="p-6 bg-slate-800 rounded-xl">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Simple Pricing</h2>
            <button
              onClick={() => setMonthly(!monthly)}
              className="px-4 py-2 bg-indigo-600 rounded-lg text-sm"
            >
              {monthly ? "Yearly (Save 20%)" : "Monthly"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-xl border ${
                  p.highlight
                    ? "bg-indigo-600 border-indigo-500 scale-105"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-sm opacity-80">{p.desc}</p>

                <div className="mt-4 text-3xl font-extrabold">
                  ₹{calcPrice(p.price)}
                  <span className="text-sm">
                    /{monthly ? "mo" : "yr"}
                  </span>
                </div>

                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                <Link
                  to={`/signup?plan=${p.id}`}
                  className="block mt-6 text-center px-4 py-2 bg-black/30 rounded-lg"
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-400">
            ✔ Secure payments via Razorpay · ✔ Cancel anytime · ✔ GST invoice
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-slate-800 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Automatrixx AI ·
        <Link to="/privacy" className="underline mx-2">Privacy</Link>·
        <Link to="/terms" className="underline mx-2">Terms</Link>·
        <Link to="/refund" className="underline mx-2">Refund</Link>·
        <Link to="/contact" className="underline mx-2">Contact</Link>
      </footer>

    </div>
  );
}