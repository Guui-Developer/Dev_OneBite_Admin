/**
 * 퍼블릭 API - 콘텐츠 목록 조회 파라미터
 */
export interface GetContentListParams {
  /**
   * 랜덤화를 위한 시드값 (필수)
   */
  seed: number;

  /**
   * 커서 기반 페이지네이션용 ID (선택)
   */
  lastSeenId?: number;

  /**
   * 카테고리 필터 (선택, 쉼표로 구분)
   * 예: "javascript,react"
   */
  categories?: string;

  /**
   * 가져올 개수 (1-100)
   */
  limit?: number;
}