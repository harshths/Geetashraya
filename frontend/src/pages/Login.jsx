import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { getProfile } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/auth/login", form);
    await getProfile();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 🎵
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-black/40 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white font-semibold shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:underline"
          >
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;