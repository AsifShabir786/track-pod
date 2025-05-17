// src/pages/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // User is not logged in, redirect to login page
    return <Navigate to="/LoginPage" replace />;
  }
  // User is authenticated, allow access
  return children;
};

export default ProtectedRoute;
