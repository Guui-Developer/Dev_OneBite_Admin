import type { ContentType } from '../../public/response/content_types';

/**
 * 어드민 API - 콘텐츠 목록 조회 파라미터
 */
export interface GetAdminContentListParams {
  keyword?: string;
  page?: number;
  size?: number;
  type?: string;
}

/**
 * 콘텐츠 생성 요청 - 기본 필드
 */
interface BaseContentRequest {
  type: ContentType;
  title: string;
  tags: string[];
}

/**
 * code_tip 타입 콘텐츠 생성 요청
 */
export interface CreateCodeTipRequest extends BaseContentRequest {
  type: 'code_tip';
  code: string;
  language: string;
  description: string;
}

/**
 * bug_challenge 타입 콘텐츠 생성 요청
 */
export interface CreateBugChallengeRequest extends BaseContentRequest {
  type: 'bug_challenge';
  code: string;
  answer: string;
  language: string;
}

/**
 * interview 타입 콘텐츠 생성 요청
 */
export interface CreateInterviewRequest extends BaseContentRequest {
  type: 'interview';
  question: string;
  answer: string;
  tails?: string[];
}

/**
 * code_review 타입 콘텐츠 생성 요청
 */
export interface CreateCodeReviewRequest extends BaseContentRequest {
  type: 'code_review';
  before: string;
  after: string;
  feedback: string;
  language: string;
}

/**
 * meme 타입 콘텐츠 생성 요청
 */
export interface CreateMemeRequest extends BaseContentRequest {
  type: 'meme';
  image: string;
  description: string;
}

/**
 * 콘텐츠 생성 요청 (모든 타입)
 */
export type CreateContentRequest =
  | CreateCodeTipRequest
  | CreateBugChallengeRequest
  | CreateInterviewRequest
  | CreateCodeReviewRequest
  | CreateMemeRequest;

/**
 * 콘텐츠 수정 요청 (전체 수정 - PUT)
 * 모든 필드를 교체합니다
 */
export type UpdateContentRequest = CreateContentRequest;

/**
 * 콘텐츠 삭제 요청
 */
export interface DeleteContentRequest {
  ids: number[];
}
