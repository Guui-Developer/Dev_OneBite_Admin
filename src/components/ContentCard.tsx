import { cn } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import Card from '@/components/Card';
import type { LearningData } from '@/api/model/response/learndata';
import {
  isCodeTip,
  isBugChallenge,
  isCodeReview,
  isMeme,
  isInterview
} from '@/api/model/response/learndata';
import {
  CodeTipContent,
  BugChallengeContent,
  CodeReviewContent,
  MemeContent,
  InterviewContent
} from '@/components/content';
import { categoryStore } from '@/store/categoryStore';

interface ContentCardProps {
  content: LearningData;
  isBookmarked?: boolean;
  onToggleBookmark?: (contentId: number) => void;
}

function getTypeBadgeStyles(type: string): string {
  switch (type) {
    case 'code_tip':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'bug_challenge':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'code_review':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'meme':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'interview':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    default:
      return 'bg-[#2D2D2D] text-[#B0B0B0] border border-[#444]';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'code_tip':
      return '💡 코드 팁';
    case 'bug_challenge':
      return '🐛 버그 챌린지';
    case 'code_review':
      return '👨‍💻 코드 리뷰';
    case 'meme':
      return '😂 밈 / 📰뉴스';
    case 'interview':
      return '🎯 면접 질문';
    default:
      return '📦 콘텐츠';
  }
}

function renderContentByType(content: LearningData) {
  if (isCodeTip(content)) {
    return <CodeTipContent content={content} />;
  }

  if (isBugChallenge(content)) {
    return <BugChallengeContent content={content} />;
  }

  if (isCodeReview(content)) {
    return <CodeReviewContent content={content} />;
  }

  if (isMeme(content)) {
    return <MemeContent content={content} />;
  }

  if (isInterview(content)) {
    return <InterviewContent content={content} />;
  }

  return null;
}

interface CategoryInfo {
  icon: string;
  label: string;
}

export default function ContentCard({ content, isBookmarked = false, onToggleBookmark }: ContentCardProps) {
  const { categories } = categoryStore();
  const categoryMap = new Map<string, CategoryInfo>();

  categories.forEach((group: { categories: Array<{ key: string; icon: string; label: string }> }) => {
    group.categories.forEach((category: { key: string; icon: string; label: string }) => {
      categoryMap.set(category.key, {
        icon: category.icon,
        label: category.label,
      });
    });
  });

  const getCategoryInfo = (categoryKey: string): CategoryInfo | undefined => {
    return categoryMap.get(categoryKey);
  };

  return (
    <Card padding="md" className="bg-[#1A1A1A] border-2 border-[#2D2D2D] flex-col flex gap-4">
      <div className="flex items-center justify-between">
        <span className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
          getTypeBadgeStyles(content.type)
        )}>
          {getTypeLabel(content.type)}
        </span>

        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(content.id)}
            className={cn(
              'p-2 hover:bg-[#2D2D2D] rounded-lg transition-all',
              isBookmarked && 'text-[#00D9FF]'
            )}
          >
            <Icon
              name="Heart"
              type="lucide"
              size={20}
              className={cn(isBookmarked && 'fill-current')}
            />
          </button>
        )}
      </div>

      <h1 className="text-xl font-bold text-white">
        {content.title}
      </h1>

      <div>
        {renderContentByType(content)}
      </div>

      <div className="flex flex-wrap gap-2">
        {content.tags.map((tag: string, idx: number) => {
          const categoryInfo = getCategoryInfo(tag);

          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-[#2D2D2D] text-[#D0D0D0] border border-[#444]"
            >
              {categoryInfo?.icon && (
                <img
                  src={categoryInfo.icon}
                  alt={categoryInfo.label}
                  className="w-3.5 h-3.5"
                  onError={(e) => {
                    console.error('Failed to load icon:', categoryInfo.icon);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              {categoryInfo?.label || tag}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
