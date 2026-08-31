import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cerrarSesion, continuarSesion, obtenerSesion } from "./authService";
import type { AuthContextType, Session } from "./interfaces/sessionInterface";
import { AUTH_LOGOUT_EVENT } from "./interfaces/authEvents";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";

const AuthContext = createContext<AuthContextType>(null!);

// 15 minutos sin actividad
const INACTIVITY_LIMIT = 15 * 60 * 1000;

// Mostrar advertencia al minuto 14
const WARNING_TIME = 14 * 60 * 1000;

// Se renueva el access token cuando queden 5 minutos o menos y el usuario siga activo
const TOKEN_RENEWAL_THRESHOLD = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const renewingTokenRef = useRef(false);

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

  /*
   * Limpia únicamente el estado de React.
   *
   * Se utiliza después de que backend haya
   * eliminado las cookies o cuando se recibe
   * un evento de sesión inválida.
   */
  function logout() {
    setSessionExpiring(false);
    setSecondsRemaining(0);
    setUser(null);
  }
  /*
   * Logout real.
   *
   * Intenta informar al backend para eliminar
   * access_token y refresh_token.
   */
  async function finalizarSesion() {
    try {
      await cerrarSesion();
    } catch {
      // Aunque falle la petición, se limpia
      // el estado local de autenticación.
    } finally {
      logout();
    }
  }
  /*
   * Botón "Continuar sesión".
   *
   * Genera un nuevo access token de 15 minutos
   * y reinicia el contador de inactividad.
   */
  async function mantenerSesionActiva() {
    try {
      await continuarSesion();

      lastActivityRef.current = Date.now();

      setSessionExpiring(false);
      setSecondsRemaining(0);

      await refreshSession(false);
    } catch {
      await finalizarSesion();
    }
  }

  /*
   * Al cargar la aplicación se intenta recuperar la sesión.
   *
   * Si existe una sesión Recordarme y el access
   * token venció, apiHelper puede utilizar
   * automáticamente el refresh token.
   */
  useEffect(() => {
    void refreshSession(true);
  }, []);

  /*
   * Cada vez que cambia la sesión se reinicia
   * el control local de inactividad.
   */
  useEffect(() => {
    if (!user) {
      return;
    }
    lastActivityRef.current = Date.now();
    setSessionExpiring(false);
    setSecondsRemaining(0);
  }, [user?.usuarioId, user?.recordarme]);

  /*
   * Registrar actividad REAL del usuario.
   *
   * Solamente se utiliza cuando Recordarme
   * está desactivado.
   */
  useEffect(() => {
    if (!user || user.recordarme) {
      return;
    }

    async function registrarActividad() {
      if (!user) {
        return;
      }
      /*
       * Si ya apareció el modal, la actividad
       * genérica no reinicia el contador.
       *
       * El usuario debe pulsar explícitamente
       * "Continuar sesión".
       */
      if (sessionExpiring) {
        return;
      }
      lastActivityRef.current = Date.now();
      /*
       * Si el usuario continúa trabajando pero
       * el JWT está próximo a vencer, se renueva
       * silenciosamente ;P
       *
       * Esto convierte los 15 minutos en un
       * timeout de INACTIVIDAD y no en un límite
       * fijo desde el inicio de sesión.
       */
      const expiresAt = new Date(user.expiresAt).getTime();
      const remainingTokenTime = expiresAt - Date.now();

      if (
        remainingTokenTime <= TOKEN_RENEWAL_THRESHOLD &&
        !renewingTokenRef.current
      ) {
        try {
          renewingTokenRef.current = true;

          await continuarSesion();

          await refreshSession(false);
        } catch {
          await finalizarSesion();
        } finally {
          renewingTokenRef.current = false;
        }
      }
    }

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handler = () => {
      void registrarActividad();
    };

    events.forEach((event) => {
      window.addEventListener(event, handler, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [user?.usuarioId, user?.recordarme, user?.expiresAt, sessionExpiring]);

  /*
   * Control del timeout de inactividad.
   *
   * No se aplica a sesiones con Recordarme.
   */
  useEffect(() => {
    if (!user || user.recordarme) {
      setSessionExpiring(false);
      setSecondsRemaining(0);

      return;
    }

    function comprobarInactividad() {
      const inactivityTime = Date.now() - lastActivityRef.current;

      /*
       * 15 minutos completos:
       * cerrar sesión.
       */
      if (inactivityTime >= INACTIVITY_LIMIT) {
        setSecondsRemaining(0);
        setSessionExpiring(false);
        void finalizarSesion();
        return;
      }

      /*
       * Desde el minuto 14:
       * mostrar advertencia.
       */
      if (inactivityTime >= WARNING_TIME) {
        const remaining = INACTIVITY_LIMIT - inactivityTime;
        setSessionExpiring(true);
        setSecondsRemaining(Math.max(0, Math.ceil(remaining / 1000)));
        return;
      }

      setSessionExpiring(false);
      setSecondsRemaining(0);
    }

    comprobarInactividad();

    const interval = window.setInterval(comprobarInactividad, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [user?.usuarioId, user?.recordarme]);

  /*
   * apiHelper emite este evento cuando una sesión
   * ya no puede recuperarse.
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleUnauthorized);
    };
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);

  const seconds = secondsRemaining % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

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
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        title="Sesión próxima a expirar"
        centered
      >
        <Stack align="center" gap="md">
          <Text ta="center">Tu sesión se cerrará por inactividad en:</Text>

          <Text size="xl" fw={700}>
            {formattedTime}
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            Si deseas continuar utilizando el sistema, mantén la sesión activa.
          </Text>

          <Group justify="center" grow w="100%">
            <Button
              variant="default"
              onClick={() => {
                void finalizarSesion();
              }}
            >
              Cerrar sesión
            </Button>

            <Button
              onClick={() => {
                void mantenerSesionActiva();
              }}
            >
              Continuar sesión
            </Button>
          </Group>
        </Stack>
      </Modal>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
