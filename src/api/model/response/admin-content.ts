/**
 * 어드민 콘텐츠 응답 타입
 */

/**
 * 콘텐츠 DTO
 */
export interface ContentDto {
  contentId: number;
  type: string;
  title: string;
  code: string | null;
  description: string | null;
  answer: string | null;
  beforeCode: string | null;
  afterCode: string | null;
  feedback: string | null;
  imageUrl: string | null;
  question: string | null;
  views: number;
  bookmarks: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
