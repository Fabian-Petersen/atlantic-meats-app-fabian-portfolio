// src/lib/apiClient.ts
import axios from "axios";
import { signOut } from "aws-amplify/auth";
import { getIdToken } from "./aws-getAccessToken";

const BASE_URL = import.meta.env.VITE_SITE_URL;
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getIdToken(); // this is fine as-is
    config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // Token fetch failed — abort request, redirect to login
    const controller = new AbortController();
    controller.abort();
    config.signal = controller.signal;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
