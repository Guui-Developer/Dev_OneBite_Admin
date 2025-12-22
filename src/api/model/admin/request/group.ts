/**
 * 카테고리 그룹 요청 타입
 */

/**
 * 카테고리 그룹 생성 요청
 */
export interface CreateCategoryGroupRequest {
  groupCode: string;
  groupLabel: string;
  iconUrl: string;
}

/**
 * 카테고리 그룹 수정 요청
 */
export interface UpdateCategoryGroupRequest {
  groupId: number;
  groupCode: string;
  groupLabel: string;
  iconUrl: string;
}

/**
 * 카테고리 그룹 삭제 요청
 */
export interface DeleteCategoryGroupRequest {
  ids: number[];
}

/**
 * 카테고리 그룹 순서 변경 요청
 */
export interface ReorderCategoryGroupsRequest {
  categoryGroupIds: number[];
}
