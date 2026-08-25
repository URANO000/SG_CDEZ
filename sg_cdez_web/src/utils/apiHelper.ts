import axios from "axios";
import { AUTH_LOGOUT_EVENT } from "../services/interfaces/authEvents";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(
                new Event(AUTH_LOGOUT_EVENT)
            );
        }

        return Promise.reject(error);
    }
);