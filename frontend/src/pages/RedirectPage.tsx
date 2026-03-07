import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function RedirectPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}