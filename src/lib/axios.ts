import axios from "axios";

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000")
    : "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we receive a 401 on the client side, redirect to login
    if (error.response?.status === 401 && !isServer) {
      // Clear client state and redirect
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
