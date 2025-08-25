// lib/axios.ts
import axios, { AxiosInstance } from "axios";

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // only if your API uses cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: interceptors for logging or error normalization
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can log or shape error here if needed
    return Promise.reject(error);
  },
);

export default axiosInstance;
