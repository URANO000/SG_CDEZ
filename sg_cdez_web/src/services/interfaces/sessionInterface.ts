
export interface Session {
    usuarioId: string;
    nombreCompleto: string;
    usuario: string;
    rol: string;
}

export interface AuthContextType {
    user: Session | null;
    loading: boolean;
    refreshSession: () => Promise<void>;
    logout: () => void;
}