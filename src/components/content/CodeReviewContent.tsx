import CodeBox from '@/components/CodeBox';
import MarkdownBox from '@/components/MarkdownBox';
import type { CodeReviewData } from '@/api/model/response/content_types';

interface CodeReviewContentProps {
  content: CodeReviewData;
}

export default function CodeReviewContent({ content }: CodeReviewContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-red-400">❌ Before</h3>
        <CodeBox code={content.before} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-green-400">✅ After</h3>
        <CodeBox code={content.after} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#B0B0B0]">피드백</h3>
        <MarkdownBox content={content.feedback} />
      </div>
    </div>
  );
}
