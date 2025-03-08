import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

const RoleProtectedRoute = ({ children, roles }) => {
  const { user, loading, userRole, hasPermission } = useAuth();
 
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasPermission(roles)) {
    return <Navigate to="/unauthorize" replace />;
  }
  
  return children;
};

export default RoleProtectedRoute;
