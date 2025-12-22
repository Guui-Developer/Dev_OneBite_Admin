import { adminHttpClient } from "../httpClient";
import type { PageResponse } from "../model/public/response/page";
import type { LoginRequest } from "../model/admin/request/auth";
import type { LoginResponse } from "../model/public/response/auth";
import type {
  CreateCategoryGroupRequest,
  UpdateCategoryGroupRequest,
  DeleteCategoryGroupRequest,
  ReorderCategoryGroupsRequest,
} from "../model/admin/request/group";
import type { CategoryGroupDto } from "../model/public/response/group";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
  ReorderCategoriesRequest,
} from "../model/admin/request/category";
import type { CategoryDto } from "../model/admin/response/category";
import type {
  GetAdminContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
  DeleteContentRequest,
} from "../model/admin/request/content";
import type { ContentDto } from "../model/admin/response/content";
import {
  AUTH_ENDPOINTS,
  GROUP_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  CONTENT_ENDPOINTS,
} from "../constants/endpoints";

export class AdminApi {

  // ==================== 인증 API ====================

  /**
   * 관리자 로그인
   * POST /login
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    return adminHttpClient.post(
      AUTH_ENDPOINTS.LOGIN,
      request,
      (json: unknown) => json as LoginResponse
    );
  }

  // ==================== 카테고리 그룹 API ====================

  /**
   * 카테고리 그룹 목록 조회
   * GET /group
   */
  async getCategoryGroups(params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<CategoryGroupDto>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());

    const query = queryParams.toString();
    const url = query
      ? `${GROUP_ENDPOINTS.BASE}?${query}`
      : GROUP_ENDPOINTS.BASE;

    return adminHttpClient.get(
      url,
      (json: unknown) => json as PageResponse<CategoryGroupDto>
    );
  }

  /**
   * 카테고리 그룹 생성
   * POST /group
   */
  async createCategoryGroup(request: CreateCategoryGroupRequest): Promise<void> {
    await adminHttpClient.post(
      GROUP_ENDPOINTS.BASE,
      request,
      () => undefined
    );
  }

  /**
   * 카테고리 그룹 수정
   * PUT /group/{groupId}
   */
  async updateCategoryGroup(
    groupId: number,
    request: UpdateCategoryGroupRequest
  ): Promise<void> {
    await adminHttpClient.put(
      GROUP_ENDPOINTS.BY_ID(groupId),
      request,
      () => undefined
    );
  }

  /**
   * 카테고리 그룹 삭제
   * DELETE /group
   */
  async deleteCategoryGroups(request: DeleteCategoryGroupRequest): Promise<void> {
    await adminHttpClient.delete(GROUP_ENDPOINTS.BASE, {
      data: request,
    });
  }

  /**
   * 카테고리 그룹 순서 변경
   * PUT /group/reorder
   */
  async reorderCategoryGroups(request: ReorderCategoryGroupsRequest): Promise<void> {
    await adminHttpClient.put(
      GROUP_ENDPOINTS.REORDER,
      request,
      () => undefined
    );
  }

  // ==================== 카테고리 API ====================

  /**
   * 카테고리 목록 조회
   * GET /categories
   */
  async getCategories(params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<CategoryDto>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());

    const query = queryParams.toString();
    const url = query
      ? `${CATEGORY_ENDPOINTS.BASE}?${query}`
      : CATEGORY_ENDPOINTS.BASE;

    return adminHttpClient.get(
      url,
      (json: unknown) => json as PageResponse<CategoryDto>
    );
  }

  /**
   * 카테고리 생성
   * POST /categories
   */
  async createCategory(request: CreateCategoryRequest): Promise<void> {
    await adminHttpClient.post(
      CATEGORY_ENDPOINTS.BASE,
      request,
      () => undefined
    );
  }

  /**
   * 카테고리 수정
   * PUT /categories/{categoryId}
   */
  async updateCategory(
    categoryId: number,
    request: UpdateCategoryRequest
  ): Promise<void> {
    await adminHttpClient.put(
      CATEGORY_ENDPOINTS.BY_ID(categoryId),
      request,
      () => undefined
    );
  }

  /**
   * 카테고리 삭제
   * DELETE /categories
   */
  async deleteCategories(request: DeleteCategoryRequest): Promise<void> {
    await adminHttpClient.delete(CATEGORY_ENDPOINTS.BASE, {
      data: request,
    });
  }

  /**
   * 카테고리 순서 변경
   * PUT /categories/reorder
   */
  async reorderCategories(request: ReorderCategoriesRequest): Promise<void> {
    await adminHttpClient.put(
      CATEGORY_ENDPOINTS.REORDER,
      request,
      () => undefined
    );
  }

  // ==================== 콘텐츠 API ====================

  /**
   * 콘텐츠 목록 조회
   * GET /content
   */
  async getContentList(
    params?: GetAdminContentListParams
  ): Promise<PageResponse<ContentDto>> {
    const queryParams = new URLSearchParams();
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());

    const query = queryParams.toString();
    const url = query
      ? `${CONTENT_ENDPOINTS.BASE}?${query}`
      : CONTENT_ENDPOINTS.BASE;

    return adminHttpClient.get(
      url,
      (json: unknown) => json as PageResponse<ContentDto>
    );
  }

  /**
   * 콘텐츠 생성
   * POST /content
   */
  async createContent(request: CreateContentRequest): Promise<void> {
    await adminHttpClient.post(
      CONTENT_ENDPOINTS.BASE,
      request,
      () => undefined
    );
  }

  /**
   * 콘텐츠 수정
   * PUT /content/{contentId}
   */
  async updateContent(
    contentId: number,
    request: UpdateContentRequest
  ): Promise<void> {
    await adminHttpClient.put(
      CONTENT_ENDPOINTS.BY_ID(contentId),
      request,
      () => undefined
    );
  }

  /**
   * 콘텐츠 삭제
   * DELETE /content
   */
  async deleteContent(request: DeleteContentRequest): Promise<void> {
    await adminHttpClient.delete(CONTENT_ENDPOINTS.BASE, {
      data: request,
    });
  }
}
