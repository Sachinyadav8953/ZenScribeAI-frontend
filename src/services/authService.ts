import { api } from "../lib/axios";
import { User, TokenResponse } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await api.post("/api/auth/login", { email, password }, {
      // Don't route through API proxy since /api/auth/login is a local Next.js Route Handler
      baseURL: "", 
    });
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/auth/logout", {}, {
      baseURL: "",
    });
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get("/api/auth/me", {
      baseURL: "",
    });
    return res.data;
  },

  async register(data: any): Promise<User> {
    // Goes through API proxy which forwards to http://localhost:8000/auth/register
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  async resetPassword(data: any): Promise<{ message: string }> {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  },

  async getWsToken(): Promise<string> {
    const res = await api.get("/api/auth/token", {
      baseURL: "",
    });
    return res.data.token;
  }
};
