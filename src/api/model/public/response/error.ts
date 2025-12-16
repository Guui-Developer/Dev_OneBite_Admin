/**
 * 에러 응답 타입
 */

import type { ErrorDetail } from "./common";

export type { ErrorDetail } from "./common";

/**
 * 에러 응답
 */
export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

/**
 * 에러 코드
 */
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATED_CODE: "DUPLICATED_CODE",
  CODE_NOT_FOUND: "CODE_NOT_FOUND",
  INVALID_CODE_LENGTH: "INVALID_CODE_LENGTH",
  ID_NOT_FOUND: "ID_NOT_FOUND",
  DELETE_DATA_NOT_FOUND: "DELETE_DATA_NOT_FOUND",
  CONTENT_NOT_FOUND: "CONTENT_NOT_FOUND",
  AWS_ERROR: "AWS_ERROR",
  ADMIN_LOGIN_FAIL: "ADMIN_LOGIN_FAIL",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
