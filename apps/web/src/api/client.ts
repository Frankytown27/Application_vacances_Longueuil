import axios from "axios";
import { acquireToken } from "../auth/azureAd";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await acquireToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error", error);
    throw error;
  },
);
