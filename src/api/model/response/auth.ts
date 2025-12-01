// 로그인 성공 응답 데이터
export interface LoginData {
  accessToken: string;
  expiresIn: number;
  accessExpiresAt: string;
}

// 로그인 성공 응답
export interface LoginResponse {
  status: string;
  data: LoginData;
}
