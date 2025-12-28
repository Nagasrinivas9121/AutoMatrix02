import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import NotificationPanel from "../components/NotificationPanel";
import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext";

const Header = ({ setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useUser();

  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New ticket created", time: "2 min ago", read: false },
    { id: 2, text: "AI reply generated", time: "10 min ago", read: false },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  // Page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/app" || path === "/app/") return "Dashboard";
    if (path.startsWith("/app/tickets")) return "Tickets";
    if (path.startsWith("/app/customers")) return "Customers";
    if (path.startsWith("/app/settings")) return "Settings";
    if (path.startsWith("/admin")) return "Admin Panel";
    return "Automatrixx AI";
  };

  // Close popups on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpenMenu(false);
      if (!notifRef.current?.contains(e.target)) setOpenNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarSrc =
    user?.avatar && user.avatar.trim() !== ""
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.name || "User"
        )}&background=4F46E5&color=fff`;

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-slate-200 dark:bg-slate-700"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <img src={logo} alt="Automatrixx" className="w-8 h-8 rounded-lg" />

        <h2 className="text-xl font-bold">{getPageTitle()}</h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* ✅ ADMIN BUTTON (ONLY FOR ADMIN) */}
        {user?.role === "ADMIN" && (
          <a
            href="/admin"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold
            bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Admin
          </a>
        )}

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenMenu(false);
            }}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 relative"
          >
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-3 w-80 z-30">
              <NotificationPanel
                notifications={notifications}
                onMarkRead={markRead}
                onMarkAllRead={markAllRead}
              />
            </div>
          )}
        </div>

        <DarkModeToggle />

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setOpenMenu(!openMenu);
              setOpenNotif(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <img src={avatarSrc} className="w-8 h-8 rounded-full" />
            <span className="hidden md:block font-medium">Account</span>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-slate-800 rounded-xl border shadow-lg">
              <button
                onClick={() => (window.location.href = "/app/settings")}
                className="block w-full px-4 py-2 text-left hover:bg-slate-100"
              >
                Settings
              </button>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;