/**
 * 콘텐츠 타입 정의
 */

export type ContentType =
  | "code_review"
  | "meme"
  | "bug_challenge"
  | "interview"
  | "code_tip";

interface BaseContent {
  id: number;
  type: ContentType;
  title: string;
  tags: string[];
  createdAt: string;
}

/**
 * 코드 리뷰 타입 콘텐츠
 */
export interface CodeReviewContent extends BaseContent {
  type: "code_review";
  before: string;
  after: string;
  feedback: string;
}

/**
 * 밈 타입 콘텐츠
 */
export interface MemeContent extends BaseContent {
  type: "meme";
  image: string;
  description: string;
}

/**
 * 버그 챌린지 타입 콘텐츠
 */
export interface BugChallengeContent extends BaseContent {
  type: "bug_challenge";
  code: string;
  answer: string;
}

/**
 * 면접 질문 타입 콘텐츠
 */
export interface InterviewContent extends BaseContent {
  type: "interview";
  question: string;
  answer: string;
  tails: string[];
}

/**
 * 코드 팁 타입 콘텐츠
 */
export interface CodeTipContent extends BaseContent {
  type: "code_tip";
  code: string;
  language: string;
  description: string;
}

/**
 * 콘텐츠 유니온 타입
 */
export type Content =
  | CodeReviewContent
  | MemeContent
  | BugChallengeContent
  | InterviewContent
  | CodeTipContent;

/**
 * 별칭 - 다른 파일에서 사용하는 타입명
 */
export type LearningData = Content;
export type CodeTipData = CodeTipContent;
export type BugChallengeData = BugChallengeContent;
export type CodeReviewData = CodeReviewContent;
export type InterviewData = InterviewContent;
export type MemeData = MemeContent;

/**
 * 콘텐츠 목록 응답 데이터
 */
export interface GetLearningDataListData {
  content: Content[];
  pagination: {
    total: number;
    returnedCount: number;
    hasNext: boolean;
  };
}
