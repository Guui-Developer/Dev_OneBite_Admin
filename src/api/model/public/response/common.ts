export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface FailureResponse {
  success: false;
  error: ErrorDetail;
}

export interface ErrorDetail {
    code: string;
    message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;
