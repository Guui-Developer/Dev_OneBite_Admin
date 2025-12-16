/**
 * 카테고리 요청 타입
 */

/**
 * 카테고리 생성 요청
 */
export interface CreateCategoryRequest {
  categoryGroupId: number;
  code: string;
  label: string;
  iconUrl?: string;
  description?: string;
}

/**
 * 카테고리 수정 요청
 */
export interface UpdateCategoryRequest {
  categoryGroupId: number;
  code: string;
  label: string;
  iconUrl?: string;
  displayOrder: number;
}

/**
 * 카테고리 삭제 요청
 */
export interface DeleteCategoryRequest {
  ids: number[];
  force: boolean;
}
