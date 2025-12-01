import { httpClient } from '@/api';
import type { LoginRequest } from '../model/request/auth';
import type { LoginResponse } from '../model/response/auth';

export class AuthApi {
  /**
   * 관리자 로그인
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>(
      '/auth/login',
      credentials,
      (data) => data as LoginResponse
    );
  }
}
