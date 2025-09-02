import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (!data || data?.attributes?.user?.role !== "admin") {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
