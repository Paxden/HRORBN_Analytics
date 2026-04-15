import React from 'react'
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RootRedirect() {
 const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

export default RootRedirect
