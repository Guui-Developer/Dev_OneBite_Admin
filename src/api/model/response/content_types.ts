export type ContentType =
    | 'code_tip'
    | 'bug_challenge'
    | 'code_review'
    | 'meme'
    | 'interview';

export type LearningData =
    | CodeTipData
    | BugChallengeData
    | CodeReviewData
    | MemeData
    | InterviewData;

interface BaseLearningData {
    id: number;
    type: ContentType;
    title: string;
    tags: string[];
    createdAt: string;
}

/** 1. 코드 팁 (code_tip) */
export interface CodeTipData extends BaseLearningData {
    type: 'code_tip';
    code: string;
    description: string;
    language: string;
}

/** 2. 버그 챌린지 (bug_challenge) */
export interface BugChallengeData extends BaseLearningData {
    type: 'bug_challenge';
    code: string;
    answer: string;
}

/** 3. 코드 리뷰 (code_review) */
export interface CodeReviewData extends BaseLearningData {
    type: 'code_review';
    before: string;
    after: string;
    feedback: string;
}

/** 4. 밈 (meme) */
export interface MemeData extends BaseLearningData {
    type: 'meme';
    image: string;
    description: string;
}

/** 5. 면접 질문 (interview) */
export interface InterviewData extends BaseLearningData {
    type: 'interview';
    question: string;
    answer: string;
    tails: string[];
}


// ============================================
// Response Types
// ============================================

/** 페이지네이션 정보 */
export interface PaginationInfo {
    lastSeenId: number;
    limit: number;
    total: number;
    hasNext: boolean;
    returnedCount: number;
}

export interface FilterInfo {
    categories: string[];
    appliedCount: number;
}

export interface GetLearningDataListData {
    content: LearningData[];
    pagination: PaginationInfo;
    filters: FilterInfo;
}

/** 최종 응답 */
export interface GetLearningDataListResponse {
    success: boolean;
    data: GetLearningDataListData;
}

export function isCodeTip(data: LearningData): data is CodeTipData {
    return data.type === 'code_tip';
}

export function isBugChallenge(data: LearningData): data is BugChallengeData {
    return data.type === 'bug_challenge';
}

export function isCodeReview(data: LearningData): data is CodeReviewData {
    return data.type === 'code_review';
}

export function isMeme(data: LearningData): data is MemeData {
    return data.type === 'meme';
}

export function isInterview(data: LearningData): data is InterviewData {
    return data.type === 'interview';
}