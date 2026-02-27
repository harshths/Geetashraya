import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const imageUrl = user?.profilePic;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          IndieWave
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-indigo-400">
            Home
          </Link>
          <Link to="/albums" className="hover:text-indigo-400">
            Albums
          </Link>

          {user && (
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={imageUrl}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-600"
              />
              <span className="hover:text-indigo-400">{user.username}</span>
            </Link>
          )}

          {user?.role === "artist" && (
            <Link to="/artist" className="hover:text-indigo-400">
              Dashboard
            </Link>
          )}

          {!user && <Link to="/login">Login</Link>}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-indigo-500 px-4 py-1 rounded-lg hover:bg-indigo-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
