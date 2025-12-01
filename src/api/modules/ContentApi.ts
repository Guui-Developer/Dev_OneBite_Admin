import { httpClient } from '@/api';
import type {
  GetContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
  PatchContentRequest,
  BatchDeleteContentRequest,
} from '../model/request/content';
import type { GetLearningDataListData } from '@/api';
import type { SuccessMessageResponse } from '@/api';

export class ContentApi {
  /**
   * 콘텐츠 목록 조회 (Public)
   */
  static async getContentList(params: GetContentListParams): Promise<GetLearningDataListData> {
    const queryParams = new URLSearchParams();
    if (params.categories) queryParams.append('categories', params.categories);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.lastSeenId !== undefined) queryParams.append('lastSeenId', params.lastSeenId.toString());
    if (params.seed) queryParams.append('seed', params.seed.toString());

    return httpClient.get<GetLearningDataListData>(
      `/content?${queryParams.toString()}`,
      (data) => data as GetLearningDataListData
    );
  }

  /**
   * 콘텐츠 추가 (Admin)
   */
  static async createContent(data: CreateContentRequest): Promise<SuccessMessageResponse> {
    return httpClient.post<SuccessMessageResponse>(
      '/content',
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 콘텐츠 전체 수정 (Admin)
   */
  static async updateContent(id: number, data: UpdateContentRequest): Promise<SuccessMessageResponse> {
    return httpClient.put<SuccessMessageResponse>(
      `/content/${id}`,
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 콘텐츠 부분 수정 (Admin)
   */
  static async patchContent(id: number, data: PatchContentRequest): Promise<SuccessMessageResponse> {
    return httpClient.patch<SuccessMessageResponse>(
      `/content/${id}`,
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 콘텐츠 삭제 (Admin)
   */
  static async deleteContent(id: number): Promise<void> {
    return httpClient.delete(`/content/${id}`);
  }

  /**
   * 콘텐츠 대량 삭제 (Admin)
   */
  static async batchDeleteContent(data: BatchDeleteContentRequest): Promise<SuccessMessageResponse> {
    return httpClient.post<SuccessMessageResponse>(
      '/content/batch',
      data,
      (res) => res as SuccessMessageResponse
    );
  }
}

