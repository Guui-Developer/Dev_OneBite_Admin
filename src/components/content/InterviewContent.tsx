import MarkdownBox from '@/components/MarkdownBox';
import type { InterviewData } from '@/api/model/public/response/content_types';

interface InterviewContentProps {
  content: InterviewData;
}

export default function InterviewContent({ content }: InterviewContentProps) {
  return (
    <div className="flex flex-col gap-6">

      <div>
        <h3 className="text-base font-semibold text-[#00D9FF] mb-3">❓ 질문</h3>
        <div className="bg-[#2D2D2D] p-4 rounded-lg border border-[#00D9FF]">
          <MarkdownBox content={content.question}/>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[#FF9393] mb-3">💡 답변</h3>
        <div className="bg-[#2D2D2D] p-4 rounded-lg border border-[#FF9393]">
          <MarkdownBox content={content.answer} />
        </div>
      </div>


        {content.tails && content.tails.length > 0 && (
            <div className="space-y-3">
                <h3 className="text-base font-semibold text-[#FFFFF] mb-3">🔗 꼬리질문</h3>
                {content.tails.map((tailQuestion: string, index: number) => (
                    <label
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[#2D2D2D]/50 border border-[#444]/50
                         hover:border-[#FF6B6B]/50 cursor-pointer group transition-all"
                    >
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 flex-shrink-0 appearance-none rounded border-2 border-[#444] bg-[#1E1E1E]
                         cursor-pointer transition-all
                         checked:bg-[#FF6B6B] checked:border-[#FF6B6B]
                         hover:border-[#FF6B6B]/70
                         focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/50 focus:ring-offset-0
                         checked:after:content-['✓'] checked:after:block checked:after:text-white
                         checked:after:text-[10px] checked:after:text-center checked:after:leading-[14px]"
                        />
                        <p className="flex-1 text-sm text-[#B0B0B0] leading-relaxed
                          group-hover:text-white transition-colors">
                            {tailQuestion}
                        </p>
                    </label>
                ))}
            </div>
        )}
    </div>
  );
}
