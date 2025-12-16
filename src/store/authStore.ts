import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  expiresAt: string | null;
  setAuth: (token: string, expiresAt: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  isTokenExpiringSoon: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,

      setAuth: (token: string, expiresAt: string) => {
        set({ accessToken: token, expiresAt });
      },

      clearAuth: () => {
        set({ accessToken: null, expiresAt: null });
      },

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        if (!accessToken || !expiresAt) return false;

        const now = new Date();
        const expiry = new Date(expiresAt);
        return now < expiry;
      },

      isTokenExpiringSoon: () => {
        const { expiresAt } = get();
        if (!expiresAt) return false;

        const now = new Date();
        const expiry = new Date(expiresAt);
        const fiveMinutes = 5 * 60 * 1000;

        return expiry.getTime() - now.getTime() < fiveMinutes;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
