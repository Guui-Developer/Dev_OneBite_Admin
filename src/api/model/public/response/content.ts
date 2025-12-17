import type { Content } from "./content_types";

export type { Content } from "./content_types";

/**
 * 콘텐츠 목록 응답 데이터
 */
export interface ContentListData {
  content: Content[];
  lastSeenId: number | null;
  hasNext: boolean;
}
