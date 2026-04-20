/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react";
import api from "../api/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on refresh


  // ✅ LOGIN
  const login = async (data) => {
    const res = await api.post("/auth/login", data);

    const { token, user } = res.data;

    localStorage.setItem("token", token);

    setUser(user);

    return res.data; // ✅ VERY IMPORTANT
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSelectedExam(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        selectedExam,
        setSelectedExam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
