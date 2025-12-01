// 공통 에러 코드
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_CREDENTIALS'
  | 'INTERNAL_ERROR';

// 공통 에러 응답
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

// 공통 성공 응답 (메시지만)
export interface SuccessMessageResponse {
  success: true;
  message: string;
}

// 공통 성공 응답 (데이터 포함)
export interface SuccessDataResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// API 응답 유니온 타입
export type ApiResponse<T> = SuccessDataResponse<T> | ErrorResponse;
export type ApiMessageResponse = SuccessMessageResponse | ErrorResponse;
