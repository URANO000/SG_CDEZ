import { Navigate } from "react-router";
import { Loader } from "@mantine/core";
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
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "var(--bg)",
            }}>
                <Loader color="var(--color-primary)" size="lg" />
            </div>
        );
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