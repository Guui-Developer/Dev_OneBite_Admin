import {useState} from 'react';
import CodeBox from '@/components/CodeBox';
import MarkdownBox from '@/components/MarkdownBox';
import {Icon} from '@/components/icons/Icon';
import type {BugChallengeData} from '@/api/model/response/content_types';

interface BugChallengeContentProps {
    content: BugChallengeData;
}

export default function BugChallengeContent({content}: BugChallengeContentProps) {
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    return (
        <div className="space-y-2">
            <CodeBox code={content.code}/>

            <button
                style={{
                    border: '1px solid rgba(96, 96, 96, 1)',
                }}
                className="w-full h-12 flex items-center justify-center gap-2 bg-transparent rounded-full text-white text-sm font-bold transition-colors hover:bg-white/10"
                onClick={() => setIsAnswerVisible(!isAnswerVisible)}>
                <Icon name="FileText" type="lucide" size={16} className="text-white" />
                <span>{isAnswerVisible ? '정답 숨기기' : '정답 펼치기'}</span>
                <Icon
                    name={isAnswerVisible ? "ChevronUp" : "ChevronDown"}
                    type="lucide"
                    size={16}
                    className="text-white"
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isAnswerVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <MarkdownBox content={content.answer}/>
            </div>
        </div>
    );
}
