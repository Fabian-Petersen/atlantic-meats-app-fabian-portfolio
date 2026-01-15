import axios from "axios";
// import { getAccessToken } from "./aws-getAccessToken";

const BASE_URL = import.meta.env.VITE_SITE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach token to every request
// api.interceptors.request.use(async (config) => {
//   const token = await getAccessToken();
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
