/**
 * API 엔드포인트 상수
 */

/**
 * 인증 API 엔드포인트
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
} as const;

/**
 * 카테고리 그룹 API 엔드포인트
 */
export const GROUP_ENDPOINTS = {
  BASE: "/group",
  BY_ID: (groupId: number) => `/group/${groupId}`,
} as const;

/**
 * 카테고리 API 엔드포인트
 */
export const CATEGORY_ENDPOINTS = {
  BASE: "/categories",
  BY_ID: (categoryId: number) => `/categories/${categoryId}`,
} as const;

/**
 * 콘텐츠 API 엔드포인트
 */
export const CONTENT_ENDPOINTS = {
  BASE: "/content",
  BY_ID: (contentId: number) => `/content/${contentId}`,
} as const;

/**
 * 퍼블릭 API 엔드포인트
 */
export const PUBLIC_ENDPOINTS = {
  CATEGORIES: "/categories",
  CONTENT: "/content",
} as const;
