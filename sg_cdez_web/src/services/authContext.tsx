import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { obtenerSesion } from "./authService";
import type { Session } from "./sessionInterface";
import type { AuthContextType } from "./sessionInterface";

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshSession() {
        setLoading(true);

        try {
            const session = await obtenerSesion();
            setUser(session);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setUser(null);
    }

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshSession,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}