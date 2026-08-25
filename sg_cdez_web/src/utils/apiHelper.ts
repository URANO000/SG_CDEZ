import axios from "axios";
import { AUTH_LOGOUT_EVENT } from "../services/interfaces/authEvents";

export const BASE_URL = "http://localhost:8080/api";

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