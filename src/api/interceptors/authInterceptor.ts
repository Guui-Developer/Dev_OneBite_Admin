import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { AUTH_ENDPOINTS } from "../constants/endpoints";

/**
 * 인증 인터셉터
 * - 요청 시 자동으로 JWT 토큰을 Authorization 헤더에 추가
 * - 응답 시 Authorization-Update 헤더를 확인하여 토큰 자동 갱신
 */
export function installAuthInterceptor(instance: AxiosInstance): void {
  // Request Interceptor: 토큰을 헤더에 추가
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken, isAuthenticated } = useAuthStore.getState();

      // 로그인 엔드포인트는 토큰 불필요
      if (config.url?.includes(AUTH_ENDPOINTS.LOGIN)) {
        return config;
      }

      // 인증된 상태라면 토큰 추가
      if (isAuthenticated() && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: 토큰 자동 갱신 (로그인은 Login.tsx에서 직접 처리)
  instance.interceptors.response.use(
    (response) => {
      const { setAuth } = useAuthStore.getState();

      // Authorization-Update 헤더 확인 - 토큰 자동 갱신
      const authUpdate = response.headers["authorization-update"];
      if (authUpdate) {
        // "Bearer <token>" 형식에서 토큰 추출
        const newToken = authUpdate.replace(/^Bearer\s+/i, "");

        // 새로운 만료 시간 계산 (현재 시간 + 1시간)
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        // 토큰 갱신
        setAuth(newToken, expiresAt);

        console.log("[Auth] Token automatically renewed from Authorization-Update header");
      }

      return response;
    },
    (error) => {
      // 401 에러 시 로그아웃 처리
      if (error.response?.status === 401) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        console.log("[Auth] Unauthorized - cleared auth");
      }

      return Promise.reject(error);
    }
  );
}
