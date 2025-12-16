/**
 * 페이지네이션 응답 타입
 */

/**
 * 페이지 응답 래퍼
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
