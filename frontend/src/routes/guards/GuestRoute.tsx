import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { pb } from "../../lib/pocketbase";

export const GuestRoute: React.FC = () => {
  const isAuthenticated = pb.authStore.isValid;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
