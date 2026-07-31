import { Navigate } from "react-router";
import { useAuth } from "./services/authContext";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
    roles?: string[];
}

export function ProtectedRoute({
    children,
    roles,
}: Props) {

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        roles &&
        !roles.includes(user.rol)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}