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

/**
 * 인증 상태 관리 Store
 * - accessToken: JWT 액세스 토큰
 * - expiresAt: 토큰 만료 시각 (ISO 8601)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,

      /**
       * 인증 정보 설정
       */
      setAuth: (token: string, expiresAt: string) => {
        set({ accessToken: token, expiresAt });
      },

      /**
       * 인증 정보 초기화
       */
      clearAuth: () => {
        set({ accessToken: null, expiresAt: null });
      },

      /**
       * 인증 여부 확인
       */
      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        if (!accessToken || !expiresAt) return false;

        // 토큰이 만료되었는지 확인
        const now = new Date();
        const expiry = new Date(expiresAt);
        return now < expiry;
      },

      /**
       * 토큰이 곧 만료되는지 확인 (5분 이내)
       */
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
