import {
    createContext,
    useEffect,
    useContext,
    useState,
} from "react";

import { obtenerSesion } from "./authService";
import type { Session } from "./interfaces/sessionInterface";
import type { AuthContextType } from "./interfaces/sessionInterface";
import { AUTH_LOGOUT_EVENT } from "./interfaces/authEvents";
import { Modal, Button, Text, Stack } from "@mantine/core";

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpiring, setSessionExpiring] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(0);


    async function refreshSession(showLoading = false) {
        if (showLoading) {
            setLoading(true);
        }

        try {
            const session = await obtenerSesion();
            setUser(session);
        } catch {
            setUser(null);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }

    function logout() {
        setSessionExpiring(false);
        setSecondsRemaining(0);
        setUser(null);
    }

    useEffect(() => {
        refreshSession(true);
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const interval = window.setInterval(() => {
            refreshSession(false);
        }, 60_000);

        return () => {
            window.clearInterval(interval);
        };
    }, [user?.usuarioId]);

    useEffect(() => {
        if (!user?.expiresAt) {
            return;
        }

        const expiresAt = new Date(user.expiresAt).getTime();

        console.log("expiresAt raw:", user.expiresAt);
        console.log(
            "expiresAt parsed:",
            new Date(expiresAt).toString()
        );
        console.log(
            "now:",
            new Date().toString()
        );
        console.log(
            "remaining seconds:",
            Math.floor((expiresAt - Date.now()) / 1000)
        );
        const WARNING_TIME = 2 * 60 * 1000;

        function updateExpiration() {
            const remaining = expiresAt - Date.now();

            if (remaining <= 0) {
                setSecondsRemaining(0);
                logout();
                return;
            }

            if (remaining <= WARNING_TIME) {
                setSessionExpiring(true);
                setSecondsRemaining(Math.ceil(remaining / 1000));
            } else {
                setSessionExpiring(false);
                setSecondsRemaining(0);
            }
        }

        updateExpiration();

        const interval = window.setInterval(
            updateExpiration,
            1000
        );

        return () => {
            window.clearInterval(interval);
        };
    }, [user?.expiresAt]);

    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener(
            AUTH_LOGOUT_EVENT,
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                AUTH_LOGOUT_EVENT,
                handleUnauthorized
            );
        };
    }, []);

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    const formattedTime =
        `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                sessionExpiring,
                refreshSession: () => refreshSession(false),
                logout,
            }}
        >
            <Modal
                opened={sessionExpiring}
                onClose={() => { }}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                title="Sesión próxima a expirar"
            >
                <Stack align="center" gap="md">
                    <Text>
                        Tu sesión está próxima a expirar.
                    </Text>

                    <Text
                        size="xl"
                        fw={700}
                    >
                        {formattedTime}
                    </Text>

                    <Text size="sm" c="dimmed">
                        Guarda los cambios pendientes antes de que finalice tu sesión.
                    </Text>

                    <Button
                        onClick={logout}
                        fullWidth
                    >
                        Cerrar sesión
                    </Button>
                </Stack>
            </Modal>

            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}