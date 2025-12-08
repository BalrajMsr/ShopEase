import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useSelector((state) => state.user);

    // Check if user is authenticated
    if (!userInfo?.token) {
        return <Navigate to="/login" replace />;
    }

    // Check if route requires admin access
    if (adminOnly && userInfo?.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;
