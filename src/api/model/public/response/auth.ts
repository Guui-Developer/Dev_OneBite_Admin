/**
 * 인증 응답 타입
 */

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  accessExpiresAt: string;
}
