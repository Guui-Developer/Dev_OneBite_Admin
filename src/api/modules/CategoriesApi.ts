import { httpClient } from '@/api';
import type { CategoriesData, CreateCategoryResponse } from '@/api';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PatchCategoryRequest,
  DeleteCategoryQuery,
} from '@/api';
import type { SuccessMessageResponse } from '@/api';

export class CategoriesApi {
  /**
   * 카테고리 목록 조회 (Public)
   */
  static async getCategories(): Promise<CategoriesData> {
    return httpClient.get<CategoriesData>(
      '/categories',
      (data) => data as CategoriesData
    );
  }

  /**
   * 카테고리 추가 (Admin)
   */
  static async createCategory(data: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    return httpClient.post<CreateCategoryResponse>(
      '/categories',
      data,
      (res) => res as CreateCategoryResponse
    );
  }

  /**
   * 카테고리 전체 수정 (Admin)
   */
  static async updateCategory(key: string, data: UpdateCategoryRequest): Promise<SuccessMessageResponse> {
    return httpClient.put<SuccessMessageResponse>(
      `/categories/${key}`,
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 카테고리 부분 수정 (Admin)
   */
  static async patchCategory(key: string, data: PatchCategoryRequest): Promise<SuccessMessageResponse> {
    return httpClient.patch<SuccessMessageResponse>(
      `/categories/${key}`,
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 카테고리 삭제 (Admin)
   */
  static async deleteCategory(key: string, query?: DeleteCategoryQuery): Promise<void> {
    const params = query?.force ? `?force=true` : '';
    return httpClient.delete(`/categories/${key}${params}`);
  }
}
