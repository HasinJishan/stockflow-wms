import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  // 1. If context is still loading data, show a spinner (important for team projects)
  if (loading) return <div className="loading-screen">Verifying Session...</div>;

  // 2. If no user, go to login
  if (!user) return <Navigate to="/login" replace />;

  // 3. Professional Role Check (Trim spaces and ignore case)
  const userRole = user.role.toLowerCase().trim();
  const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (allowedRoles && !hasPermission) {
    console.warn(`Access Denied: ${userRole} is not in ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return children;
}