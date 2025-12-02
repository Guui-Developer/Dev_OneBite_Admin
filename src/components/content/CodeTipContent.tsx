import CodeBox from '@/components/CodeBox';
import MarkdownBox from '@/components/MarkdownBox';
import type { CodeTipData } from '@/api/model/response/content_types';

interface CodeTipContentProps {
  content: CodeTipData;
}

export default function CodeTipContent({ content }: CodeTipContentProps) {
  return (
    <div className="space-y-3">
      <CodeBox code={content.code} language={content.language} title={content.language}/>
      <MarkdownBox content={content.description} />
    </div>
  );
}
