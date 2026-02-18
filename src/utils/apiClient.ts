import axios from "axios";
import { getIdToken } from "./aws-getAccessToken";

const BASE_URL = import.meta.env.VITE_SITE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// $ Use inteceptors to This ensures:
// $ - token is fresh
// $ - always sent per request
// $ - works with Amazon Cognito User Pool authorizer

apiClient.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
