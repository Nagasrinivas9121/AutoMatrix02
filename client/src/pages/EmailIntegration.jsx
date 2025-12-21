import React from "react";

export default function EmailIntegration() {

  const connect = (provider) => {
    // 🚀 MUST be backend absolute URL
    window.location.href = `http://localhost:8081/api/oauth/${provider}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-2">Email Integration</h1>
      <p className="text-sm text-slate-500 mb-6">
        Securely connect your support email.
        <br />
        <b>No passwords required.</b>
      </p>

      <div className="space-y-4">
        <ProviderCard
          title="Gmail / Google Workspace"
          color="bg-red-600"
          onClick={() => connect("google")}
        />
        <ProviderCard
          title="Outlook / Microsoft 365"
          color="bg-blue-600"
          onClick={() => connect("microsoft")}
        />
        <ProviderCard
          title="Zoho Mail"
          color="bg-green-600"
          onClick={() => connect("zoho")}
        />
      </div>
    </div>
  );
}

function ProviderCard({ title, color, onClick }) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <h3 className="font-semibold">{title}</h3>
      <button
        onClick={onClick}
        className={`${color} text-white px-4 py-2 rounded-lg`}
      >
        Connect
      </button>
    </div>
  );
}