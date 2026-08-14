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
    // If we receive a 401 on the client side, redirect to login unless we are on login endpoint/page
    if (error.response?.status === 401 && !isServer) {
      const requestUrl = error.config?.url || "";
      const isLoginEndpoint = requestUrl.includes("/login") || requestUrl.includes("/auth/");
      const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

      if (!isLoginEndpoint && !isLoginPage && typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
