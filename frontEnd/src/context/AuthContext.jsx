import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {

      const res = await API.get("/profile/get");

      console.log( "user -> ", res.data.user);
      setUser(res.data.user);

    } catch (error) {
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;