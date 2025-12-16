/**
 * 어드민 카테고리 응답 타입
 */

/**
 * 카테고리 DTO
 */
export interface CategoryDto {
  categoryId: number;
  code: string;
  label: string;
  categoryGroupId: number;
  iconUrl: string | null;
  displayOrder: number | null;
}
