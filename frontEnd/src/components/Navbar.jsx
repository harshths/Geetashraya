import { NavLink } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-black dark:text-white"
        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
    }`;

  return (
    <nav className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <h1 className="font-semibold text-lg">GEETASHRAYA</h1>

        <div className="flex items-center space-x-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>

          {user && user.role === "artist" && (
            <NavLink to="/artist-dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}

          {user && (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;