/**
 * 학습 데이터 타입 정의
 */

import type {
  Content,
  CodeTipContent,
  BugChallengeContent,
  CodeReviewContent,
  MemeContent,
  InterviewContent,
} from "./content_types";

/**
 * LearningData 타입 (Content의 별칭)
 */
export type LearningData = Content;

/**
 * Type Guards
 */

export function isCodeTip(content: LearningData): content is CodeTipContent {
  return content.type === "code_tip";
}

export function isBugChallenge(
  content: LearningData
): content is BugChallengeContent {
  return content.type === "bug_challenge";
}

export function isCodeReview(
  content: LearningData
): content is CodeReviewContent {
  return content.type === "code_review";
}

export function isMeme(content: LearningData): content is MemeContent {
  return content.type === "meme";
}

export function isInterview(content: LearningData): content is InterviewContent {
  return content.type === "interview";
}
