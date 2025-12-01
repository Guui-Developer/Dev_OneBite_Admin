// 카테고리 추가 요청
export interface CreateCategoryRequest {
  groupKey: string;
  label: string;
  key: string;
  icon: string;
}

// 카테고리 전체 수정 요청
export interface UpdateCategoryRequest {
  groupKey: string;
  label: string;
  icon: string;
  description?: string;
}

// 카테고리 부분 수정 요청
export interface PatchCategoryRequest {
  label?: string;
  icon?: string;
  groupKey?: string;
  description?: string;
}

// 카테고리 삭제 쿼리
export interface DeleteCategoryQuery {
  force?: boolean;
}
