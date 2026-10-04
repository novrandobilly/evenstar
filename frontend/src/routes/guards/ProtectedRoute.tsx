import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = pb.authStore.isValid;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
