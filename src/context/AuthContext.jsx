/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on refresh - ADD THIS
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Verify token & get user
        const res = await api.get("/auth/check-auth");

        setUser(res.data.user); // 🔥 THIS WAS MISSING
      } catch (error) {
        console.error("Auth restore failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ LOGIN
  // In AuthContext.jsx - login function
  const login = async (data) => {
    console.log("Login data being sent:", data); // Debug log

    try {
      const res = await api.post("/auth/login", data);
      console.log("Login response:", res.data);

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return res.data;
    } catch (error) {
      console.error("Login error details:", error.response?.data); // This is important!
      throw error;
    }
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
