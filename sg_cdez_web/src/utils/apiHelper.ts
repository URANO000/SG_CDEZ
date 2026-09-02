import axios from "axios";
import type {
  InternalAxiosRequestConfig,
} from "axios";

import {
  AUTH_LOGOUT_EVENT,
} from "../services/interfaces/authEvents";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/*
 * Cliente separado únicamente para renovar la sesión.
 *
 * No utiliza el interceptor de apiClient para evitar
 * un ciclo infinito si /auth/refresh responde 401.
 */
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface RetryableRequest
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<void> | null = null;

async function renovarSesion(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as RetryableRequest | undefined;

    const status = error.response?.status;

    if (
      status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    /*
     * Una petición solo puede intentar renovarse
     * una vez.
     */
    if (originalRequest._retry) {
      window.dispatchEvent(
        new Event(AUTH_LOGOUT_EVENT),
      );

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * Si existe un refresh_token válido,
       * el backend:
       *
       * - rota el refresh token;
       * - crea un access token nuevo;
       * - actualiza ambas cookies.
       */
      await renovarSesion();

      /*
       * Se repite la petición que si originalmente 
       * falló. El navegador enviará automáticamente
       * el nuevo access_token HttpOnly.
       */
      return apiClient(originalRequest);
    } catch (refreshError) {
      /*
       * No existe refresh token, expiró,
       * fue revocado o la cuenta ya no puede
       * renovar la sesión.
       */
      window.dispatchEvent(
        new Event(AUTH_LOGOUT_EVENT),
      );

      return Promise.reject(refreshError);
    }
  },
);