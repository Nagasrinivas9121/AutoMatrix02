import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ open, setOpen }) => {
  const menuItems = [
    { name: "Dashboard", path: "/app", icon: HomeIcon, exact: true },
    { name: "Tickets", path: "/app/tickets", icon: TicketIcon },
    { name: "Customers", path: "/app/customers", icon: UsersIcon },

    // ✅ EMAIL INTEGRATION (VISIBLE NOW)
    { name: "Email Integration", path: "/app/email", icon: EnvelopeIcon },

    { name: "Settings", path: "/app/settings", icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-700
          shadow-xl lg:shadow-none
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-indigo-600">
              Automatrixx
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              AI Support Platform
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <XMarkIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 px-3 py-3 rounded-lg
                  text-sm font-medium transition
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 shadow-sm"
                      : "text-slate-700 dark:text-slate-300"
                  }
                `
              }
            >
              <item.icon className="w-5 h-5 opacity-80" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-700">
          © {new Date().getFullYear()} Automatrixx AI
        </div>
      </aside>
    </>
  );
};

export default Sidebar;