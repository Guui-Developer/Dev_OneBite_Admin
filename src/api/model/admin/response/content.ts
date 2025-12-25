import type { ContentType } from '../../public/response/content_types';

/**
 * 콘텐츠 DTO (공통 필드)
 */
interface BaseContentDto {
  contentId: number;
  type: ContentType;
  title: string;
  tags: string[];
  views: number;
  bookmarks: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * code_tip 타입 콘텐츠 DTO
 */
export interface CodeTipDto extends BaseContentDto {
  type: 'code_tip';
  code: string;
  description: string;
}

/**
 * bug_challenge 타입 콘텐츠 DTO
 */
export interface BugChallengeDto extends BaseContentDto {
  type: 'bug_challenge';
  code: string;
  answer: string;
  language: string;
}

/**
 * interview 타입 콘텐츠 DTO
 */
export interface InterviewDto extends BaseContentDto {
  type: 'interview';
  question: string;
  answer: string;
  tails?: string[];
}

/**
 * code_review 타입 콘텐츠 DTO
 */
export interface CodeReviewDto extends BaseContentDto {
  type: 'code_review';
  before: string;
  after: string;
  feedback: string;
  language: string;
}

/**
 * meme 타입 콘텐츠 DTO
 */
export interface MemeDto extends BaseContentDto {
  type: 'meme';
  image: string;
  description: string;
}

/**
 * 콘텐츠 DTO (모든 타입의 유니온)
 */
export type ContentDto =
  | CodeTipDto
  | BugChallengeDto
  | InterviewDto
  | CodeReviewDto
  | MemeDto;
