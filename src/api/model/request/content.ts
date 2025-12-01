import type { ContentType } from '../response/content_types';

// 콘텐츠 조회 파라미터
export interface GetContentListParams {
  categories?: string;
  limit?: number;
  lastSeenId?: number;
  seed?: number;
}

// 콘텐츠 생성/수정 공통 필드
interface BaseContentRequest {
  type: ContentType;
  title: string;
  tags: string[];
}

// 코드 팁 생성/수정
export interface CreateCodeTipRequest extends BaseContentRequest {
  type: 'code_tip';
  code: string;
  description: string;
  language: string;
}

// 버그 챌린지 생성/수정
export interface CreateBugChallengeRequest extends BaseContentRequest {
  type: 'bug_challenge';
  code: string;
  answer: string;
}

// 코드 리뷰 생성/수정
export interface CreateCodeReviewRequest extends BaseContentRequest {
  type: 'code_review';
  before: string;
  after: string;
  feedback: string;
}

// 밈 생성/수정
export interface CreateMemeRequest extends BaseContentRequest {
  type: 'meme';
  image: string;
  description: string;
}

// 면접 질문 생성/수정
export interface CreateInterviewRequest extends BaseContentRequest {
  type: 'interview';
  question: string;
  answer: string;
  tails: string[];
}

// 콘텐츠 생성 요청 유니온 타입
export type CreateContentRequest =
  | CreateCodeTipRequest
  | CreateBugChallengeRequest
  | CreateCodeReviewRequest
  | CreateMemeRequest
  | CreateInterviewRequest;

// 콘텐츠 전체 수정 (PUT) - CreateContentRequest와 동일
export type UpdateContentRequest = CreateContentRequest;

// 콘텐츠 부분 수정 (PATCH) - 모든 필드 선택적
export type PatchCodeTipRequest = Partial<CreateCodeTipRequest>;
export type PatchBugChallengeRequest = Partial<CreateBugChallengeRequest>;
export type PatchCodeReviewRequest = Partial<CreateCodeReviewRequest>;
export type PatchMemeRequest = Partial<CreateMemeRequest>;
export type PatchInterviewRequest = Partial<CreateInterviewRequest>;

export type PatchContentRequest =
  | PatchCodeTipRequest
  | PatchBugChallengeRequest
  | PatchCodeReviewRequest
  | PatchMemeRequest
  | PatchInterviewRequest;

// 콘텐츠 대량 삭제 요청
export interface BatchDeleteContentRequest {
  ids: number[];
}
