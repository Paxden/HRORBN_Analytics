import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null); // 🔥 important
  const [loading, setLoading] = useState(true);

  // 🔁 Check session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/check");

        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔥 Persist selected exam (restore on refresh)
  useEffect(() => {
    const savedExam = localStorage.getItem("selectedExam");
    if (savedExam) {
      try {
        setSelectedExam(JSON.parse(savedExam));
      } catch {
        localStorage.removeItem("selectedExam");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedExam) {
      localStorage.setItem("selectedExam", JSON.stringify(selectedExam));
    } else {
      localStorage.removeItem("selectedExam");
    }
  }, [selectedExam]);

  // 🔐 LOGIN
  const login = async (data) => {
    try {
      const res = await API.post("/auth/login", data);

      console.log("Login API response:", res.data);

      if (res.data.user) {
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  };

  // 🆕 SIGNUP
  const signup = async (data) => {
    const res = await API.post("/auth/signup", data);
    setUser(res.data.user);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setSelectedExam(null); // 🔥 reset exam
    localStorage.removeItem("selectedExam");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,

        // 🔥 ADD THESE (THIS FIXES YOUR ERROR)
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