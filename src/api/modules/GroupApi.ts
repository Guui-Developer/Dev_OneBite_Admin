import { httpClient } from '@/api';
import type { CreateGroupRequest, UpdateGroupRequest, DeleteGroupQuery } from '../model/request/group';
import type { SuccessMessageResponse } from '../model/response/common';

export class GroupApi {
  /**
   * 그룹 추가 (Admin)
   */
  static async createGroup(data: CreateGroupRequest): Promise<SuccessMessageResponse> {
    return httpClient.post<SuccessMessageResponse>(
      '/groups',
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 그룹 수정 (Admin)
   */
  static async updateGroup(groupKey: string, data: UpdateGroupRequest): Promise<SuccessMessageResponse> {
    return httpClient.put<SuccessMessageResponse>(
      `/groups/${groupKey}`,
      data,
      (res) => res as SuccessMessageResponse
    );
  }

  /**
   * 그룹 삭제 (Admin)
   */
  static async deleteGroup(groupKey: string, query?: DeleteGroupQuery): Promise<void> {
    const params = query?.force ? `?force=true` : '';
    return httpClient.delete(`/groups/${groupKey}${params}`);
  }
}
