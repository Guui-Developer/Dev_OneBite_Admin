// 그룹 추가 요청
export interface CreateGroupRequest {
  groupKey: string;
  groupLabel: string;
  icon: string;
}

// 그룹 수정 요청
export interface UpdateGroupRequest {
  groupLabel: string;
  icon: string;
}

// 그룹 삭제 쿼리
export interface DeleteGroupQuery {
  force?: boolean;
}
