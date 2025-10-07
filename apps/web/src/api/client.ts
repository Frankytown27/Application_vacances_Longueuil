import axios from "axios";
import { supabase } from "../lib/supabase";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
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
