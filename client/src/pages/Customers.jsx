import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // --------------------------
  // LOAD CUSTOMERS
  // --------------------------
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // --------------------------
  // SEARCH FILTER
  // --------------------------
  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q)
      )
    );
  }, [query, customers]);

  // --------------------------
  // OPEN MODAL
  // --------------------------
  const openModal = (customer = null) => {
    setEditCustomer(customer);
    setForm(customer || { name: "", email: "", phone: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditCustomer(null);
    setForm({ name: "", email: "", phone: "" });
  };

  // --------------------------
  // SAVE CUSTOMER
  // --------------------------
  const saveCustomer = async (e) => {
    e.preventDefault();

    try {
      if (editCustomer) {
        const res = await api.put(`/api/customers/${editCustomer.id}`, form);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editCustomer.id ? res.data : c))
        );
      } else {
        const res = await api.post("/api/customers", form);
        setCustomers((prev) => [...prev, res.data]);
      }
      closeModal();
    } catch (err) {
      console.error("Save customer failed:", err);
    }
  };

  // --------------------------
  // DELETE CUSTOMER
  // --------------------------
  const deleteCustomer = async () => {
    try {
      await api.delete(`/api/customers/${deleteId}`);
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
      setConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen rounded-xl animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Customers
        </h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search customers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border bg-white dark:bg-slate-800"
      />

      {/* Loading */}
      {loading && (
        <p className="text-center text-slate-400">Loading customers...</p>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone || "—"}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openModal(c)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(c.id);
                        setConfirmOpen(true);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editCustomer ? "Edit Customer" : "New Customer"}
            </h2>

            <form onSubmit={saveCustomer} className="space-y-4">
              <input
                className="w-full p-3 rounded border dark:bg-slate-700"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <input
                className="w-full p-3 rounded border dark:bg-slate-700"
                placeholder="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <input
                className="w-full p-3 rounded border dark:bg-slate-700"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Delete Customer?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}