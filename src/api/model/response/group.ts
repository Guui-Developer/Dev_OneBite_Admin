/**
 * 카테고리 그룹 응답 타입
 */

/**
 * 카테고리 그룹 DTO
 */
export interface CategoryGroupDto {
  groupId: number;
  groupCode: string;
  groupLabel: string;
  iconUrl: string | null;
  displayOrder: number | null;
}
