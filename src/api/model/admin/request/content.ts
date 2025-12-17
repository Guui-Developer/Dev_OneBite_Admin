/**
 * 어드민 API - 콘텐츠 목록 조회 파라미터
 */
export interface GetAdminContentListParams {
  keyword?: string;
  page?: number;
  size?: number;
}

/**
 * 콘텐츠 생성 요청
 */
export interface CreateContentRequest {
  type: string;
  title: string;
  code?: string;
  description?: string;
  answer?: string;
  beforeCode?: string;
  afterCode?: string;
  feedback?: string;
  imageUrl?: string;
  question?: string;
  tags?: string[];
}

/**
 * 콘텐츠 수정 요청
 */
export interface UpdateContentRequest {
  type?: string;
  title?: string;
  code?: string;
  description?: string;
  answer?: string;
  beforeCode?: string;
  afterCode?: string;
  feedback?: string;
  imageUrl?: string;
  question?: string;
  tags?: string[];
}

/**
 * 콘텐츠 삭제 요청
 */
export interface DeleteContentRequest {
  ids: number[];
  force: boolean;
}
