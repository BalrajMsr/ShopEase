import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PublicRoute Component
 * Wraps routes that should only be accessible to non-authenticated users
 * Redirects authenticated users to home page
 */
const PublicRoute = ({ children, redirectTo = "/home" }) => {
    const { userInfo } = useSelector((state) => state.user);

    // If user is authenticated, redirect to specified page
    if (userInfo?.token) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PublicRoute;
