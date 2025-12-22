/**
 * 카테고리 요청 타입
 */

/**
 * 카테고리 생성 요청
 */
export interface CreateCategoryRequest {
  categoryGroupId: number;
  label: string;
  code: string;
  iconUrl: string;
}

/**
 * 카테고리 수정 요청
 */
export interface UpdateCategoryRequest {
  categoryGroupId: number;
  label: string;
  code: string;
  iconUrl: string;
}

/**
 * 카테고리 삭제 요청
 */
export interface DeleteCategoryRequest {
  ids: number[];
}

/**
 * 카테고리 순서 변경 요청
 */
export interface ReorderCategoriesRequest {
  categoryIds: number[];
}
