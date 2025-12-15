import { publicHttpClient } from "../httpClient";
import type { CategoriesData } from "../model/response/category";
import type { ContentListData } from "../model/response/content";
import type { GetContentListParams } from "../model/request/content";
import { PUBLIC_ENDPOINTS } from "../constants/endpoints";

/**
 * 퍼블릭 API 클라이언트
 * Base URL: https://api.devonebite.xyz/{stage}
 */
export class PublicApi {
  /**
   * 카테고리 목록 조회
   * GET /categories
   */
  async getCategories(): Promise<CategoriesData> {
    return publicHttpClient.get(
      PUBLIC_ENDPOINTS.CATEGORIES,
      (json: unknown) => json as CategoriesData
    );
  }

  /**
   * 학습 데이터 목록 조회
   * GET /content
   * @param params - 조회 파라미터
   */
  async getContentList(params: GetContentListParams): Promise<ContentListData> {
    const queryParams = new URLSearchParams();
    queryParams.append("seed", params.seed.toString());

    if (params.lastSeenId !== undefined) {
      queryParams.append("lastSeenId", params.lastSeenId.toString());
    }

    if (params.categories) {
      queryParams.append("categories", params.categories);
    }

    if (params.limit !== undefined) {
      queryParams.append("limit", params.limit.toString());
    }

    return publicHttpClient.get(
      `${PUBLIC_ENDPOINTS.CONTENT}?${queryParams.toString()}`,
      (json: unknown) => json as ContentListData
    );
  }
}
