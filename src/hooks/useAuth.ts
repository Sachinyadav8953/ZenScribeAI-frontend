import { useState, useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";
import { User } from "../types";

export function useAuth() {
  const { user, isAuthenticated, accessToken, login: setLogin, logout: setLogout, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setLogin(data.user, data.token);
      return data.user;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || "Invalid email or password";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [setLogin]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error in hook:", err);
    } finally {
      setLogout();
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, [setLogout]);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      // Retrieve ws token for subsequent recordings if needed
      try {
        const token = await authService.getWsToken();
        useAuthStore.getState().setAccessToken(token);
      } catch {
        // Safe to ignore if websocket token cannot be retrieved at this moment
      }
      return currentUser;
    } catch (err: any) {
      setLogout();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setLogout]);

  return {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    error,
    login,
    logout,
    fetchProfile,
  };
}
