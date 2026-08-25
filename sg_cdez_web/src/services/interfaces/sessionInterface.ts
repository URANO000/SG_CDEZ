
export interface Session {
    usuarioId: string;
    nombreCompleto: string;
    usuario: string;
    rol: string;
    especialidad: string;
    expiresAt: string;
}

export interface AuthContextType {
    user: Session | null;
    loading: boolean;
    sessionExpiring: boolean;
    refreshSession: () => Promise<void>;
    logout: () => void;
}