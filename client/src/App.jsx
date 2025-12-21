import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

/* =======================
   PUBLIC PAGES
======================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PricingPage from "./pages/PricingPage";
import Privacy from "./pages/Privacy";

/* =======================
   USER APP PAGES
======================= */
import Dashboard from "./pages/Dashboard";
import Ticket from "./pages/Ticket";
import TicketDetails from "./pages/TicketDetails";
import NewTicket from "./pages/NewTicket";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import EmailIntegration from "./pages/EmailIntegration";

/* =======================
   UI
======================= */
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

/* =======================
   CONTEXT
======================= */
import { useUser } from "./context/UserContext";

/* =======================
   AUTH GUARDS
======================= */
const ProtectedRoute = () => {
  const { user, loadingUser } = useUser();
  if (loadingUser) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AlreadyAuthRedirect = () => {
  const { user, loadingUser } = useUser();
  if (loadingUser) return null;
  return user ? <Navigate to="/app" replace /> : <Outlet />;
};

/* =======================
   APP LAYOUT
======================= */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <aside className="hidden lg:block">
        <Sidebar open={true} setOpen={() => {}} />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white dark:bg-slate-900 border-r
        transform transition-transform lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/* =======================
   PUBLIC LAYOUT
======================= */
const PublicLayout = () => (
  <div className="min-h-screen bg-white dark:bg-slate-900">
    <Outlet />
  </div>
);

/* =======================
   ROUTES
======================= */
export default function App() {
  return (
    <Routes>

      {/* -------- PUBLIC -------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route element={<AlreadyAuthRedirect />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* -------- USER APP -------- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Ticket />} />
          <Route path="tickets/new" element={<NewTicket />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="email" element={<EmailIntegration />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* -------- FALLBACK -------- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}