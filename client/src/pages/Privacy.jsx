import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-sm text-slate-500 mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6 text-sm leading-6">
        <p>
          Automatrixx AI (“Automatrixx”, “we”, “our”, “us”) respects your privacy.
          This policy explains how we collect, use, and protect your information.
        </p>

        <h2 className="font-semibold text-lg">Information We Collect</h2>
        <ul className="list-disc ml-6">
          <li>Account details (name, email, organization)</li>
          <li>Email metadata and content for support automation</li>
          <li>OAuth tokens (securely stored)</li>
          <li>Usage and analytics data</li>
        </ul>

        <h2 className="font-semibold text-lg">How We Use Data</h2>
        <ul className="list-disc ml-6">
          <li>Provide AI-powered customer support</li>
          <li>Automate email replies</li>
          <li>Improve platform reliability</li>
          <li>Ensure security</li>
        </ul>

        <h2 className="font-semibold text-lg">OAuth & Email Security</h2>
        <p>
          We use OAuth 2.0 for Gmail and Outlook. We never store email passwords.
          Access can be revoked anytime from your email provider.
        </p>

        <h2 className="font-semibold text-lg">Your Rights</h2>
        <p>
          You may request access, correction, deletion, or export of your data
          anytime.
        </p>

        <h2 className="font-semibold text-lg">Contact</h2>
        <p>
          Email: <b>support@automatrixx.ai</b>
        </p>
      </section>
    </div>
  );
}