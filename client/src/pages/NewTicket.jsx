import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function NewTicket() {
  const navigate = useNavigate();

  // --------------------
  // FORM STATE
  // --------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [customerId, setCustomerId] = useState("");

  // --------------------
  // DATA STATE
  // --------------------
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --------------------
  // FETCH CUSTOMERS
  // --------------------
  useEffect(() => {
    let active = true;
    setLoadingCustomers(true);
    setErrorMsg("");

    api
      .get("/api/customers")
      .then((res) => {
        if (!active) return;
        setCustomers(res.data || []);
      })
      .catch(() => {
        if (!active) return;
        setErrorMsg(
          "Unable to load customers. Please ensure your backend is running."
        );
      })
      .finally(() => {
        if (active) setLoadingCustomers(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // --------------------
  // CREATE TICKET
  // --------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    if (loadingCreate) return;

    setErrorMsg("");

    if (!title.trim() || !description.trim() || !customerId) {
      setErrorMsg("Title, description and customer are required.");
      return;
    }

    try {
      setLoadingCreate(true);

      await api.post("/api/tickets", {
        title: title.trim(),
        description: description.trim(),
        priority,
        customerId,
      });

      navigate("/app/tickets");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Ticket creation failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 min-h-screen animate-fadeIn">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Create New Ticket
        </h1>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Title
            </label>
            <input
              className="w-full p-3 border rounded-lg mt-1 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="Short summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={5}
              className="w-full p-3 border rounded-lg mt-1 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="Describe the issue in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* PRIORITY */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Priority
            </label>
            <select
              className="w-full p-3 border rounded-lg mt-1 bg-slate-50 dark:bg-slate-700 dark:text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">⭐ Medium</option>
              <option value="high">🔥 High</option>
            </select>
          </div>

          {/* CUSTOMER */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Customer
            </label>

            {loadingCustomers ? (
              <div className="py-3">
                <LoadingSpinner text="Loading customers..." />
              </div>
            ) : customers.length === 0 ? (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-yellow-800 dark:text-yellow-300">
                No customers found.{" "}
                <a href="/app/customers" className="underline font-medium">
                  Add a customer
                </a>{" "}
                first.
              </div>
            ) : (
              <select
                className="w-full p-3 border rounded-lg mt-1 bg-slate-50 dark:bg-slate-700 dark:text-white"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loadingCreate || loadingCustomers}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md disabled:opacity-60"
          >
            {loadingCreate ? "Creating Ticket..." : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}