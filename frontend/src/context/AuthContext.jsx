import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await axios.get("/profile/get");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, getProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};