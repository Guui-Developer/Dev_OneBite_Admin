import { useState } from 'react';
import MarkdownBox from '@/components/MarkdownBox';
import { Icon } from '@/components/icons/Icon';
import type { MemeData } from '@/api/model/response/content_types';

interface MemeContentProps {
  content: MemeData;
}

export default function MemeContent({ content }: MemeContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-center">
          <img
            src={content.image}
            alt={content.title}
            className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsFullscreen(true)}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <MarkdownBox content={content.description} />
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <Icon name="X" type="lucide" size={24} className="text-white" />
          </button>
          <img
            src={content.image}
            alt={content.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
