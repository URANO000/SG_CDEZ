import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { obtenerSesion } from "./authService";

interface Session {
    usuarioId: string;
    usuario: string;
    rol: string;
}

interface AuthContextType {
    user: Session | null;
    loading: boolean;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshSession() {
        try {
            const session = await obtenerSesion();
            setUser(session);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}