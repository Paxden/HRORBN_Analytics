import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import Results from "./pages/Results";
import Analytics from "./pages/Analytics";
import Upload from "./pages/Upload";
import CompareExams from "./pages/CompareExam";

// 🔒 Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!user) return <Navigate to="/" />;

  return children;
}

// 🚫 Prevent logged-in users from seeing login
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* LOGIN */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* DASHBOARD LAYOUT */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="results" element={<Results />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="compare" element={<CompareExams />} />
            <Route path="upload" element={<Upload />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}