import { create } from 'zustand';
import type {
  Content as LearningData,
  ContentType
} from '@/api/model/response/content_types';
import type { ContentDto } from '@/api/model/response/admin-content';
import { AdminApi } from '@/api/modules/AdminApi';

interface GetLearningDataListData {
  content: LearningData[];
  pagination: {
    total: number;
    returnedCount: number;
    hasNext: boolean;
  };
}

const convertContentDtoToLearningData = (dto: ContentDto): LearningData => {
  const base = {
    id: dto.contentId,
    type: dto.type as ContentType,
    title: dto.title,
    tags: [],
    createdAt: dto.createdAt,
  };

  switch (dto.type) {
    case 'code_tip':
      return {
        ...base,
        type: 'code_tip',
        code: dto.code || '',
        language: '',
        description: dto.description || '',
      };
    case 'bug_challenge':
      return {
        ...base,
        type: 'bug_challenge',
        code: dto.code || '',
        answer: dto.answer || '',
      };
    case 'code_review':
      return {
        ...base,
        type: 'code_review',
        before: dto.beforeCode || '',
        after: dto.afterCode || '',
        feedback: dto.feedback || '',
      };
    case 'interview':
      return {
        ...base,
        type: 'interview',
        question: dto.question || '',
        answer: dto.answer || '',
        tails: [],
      };
    case 'meme':
      return {
        ...base,
        type: 'meme',
        image: dto.imageUrl || '',
        description: dto.description || '',
      };
  }
};

interface ContentStore {
  data: GetLearningDataListData | null;
  isLoading: boolean;
  error: string | null;
  selectedType: ContentType | 'all';

  fetchContents: (params?: { page?: number; size?: number; keyword?: string }) => Promise<void>;
  addContent: (content: LearningData) => Promise<void>;
  updateContent: (id: number, updates: Partial<LearningData>) => Promise<void>;
  deleteContent: (id: number) => Promise<void>;
  setSelectedType: (type: ContentType | 'all') => void;
  getFilteredContents: () => LearningData[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  selectedType: 'all',

  fetchContents: async (params?: { page?: number; size?: number; keyword?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const adminApi = new AdminApi();
      const response = await adminApi.getContentList({
        page: params?.page || 0,
        size: params?.size || 1000,
        keyword: params?.keyword,
      });

      const convertedContent = response.content.map(convertContentDtoToLearningData);
      const data: GetLearningDataListData = {
        content: convertedContent,
        pagination: {
          total: response.totalElements,
          returnedCount: convertedContent.length,
          hasNext: !response.last,
        },
      };

      set({
        data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch contents',
        isLoading: false,
      });
    }
  },

  addContent: async (content: LearningData) => {
    const adminApi = new AdminApi();

    const request: any = {
      type: content.type,
      title: content.title,
    };

    switch (content.type) {
      case 'code_tip':
        request.code = (content as any).code;
        request.description = (content as any).description;
        break;
      case 'bug_challenge':
        request.code = (content as any).code;
        request.answer = (content as any).answer;
        break;
      case 'code_review':
        request.beforeCode = (content as any).before;
        request.afterCode = (content as any).after;
        request.feedback = (content as any).feedback;
        break;
      case 'interview':
        request.question = (content as any).question;
        request.answer = (content as any).answer;
        break;
      case 'meme':
        request.imageUrl = (content as any).image;
        request.description = (content as any).description;
        break;
    }

    await adminApi.createContent(request);
    await get().fetchContents();
  },

  updateContent: async (id: number, updates: Partial<LearningData>) => {
    const adminApi = new AdminApi();

    const request: any = {};

    if (updates.title) request.title = updates.title;

    if ('code' in updates) request.code = (updates as any).code;
    if ('description' in updates) request.description = (updates as any).description;
    if ('answer' in updates) request.answer = (updates as any).answer;
    if ('before' in updates) request.beforeCode = (updates as any).before;
    if ('after' in updates) request.afterCode = (updates as any).after;
    if ('feedback' in updates) request.feedback = (updates as any).feedback;
    if ('question' in updates) request.question = (updates as any).question;
    if ('image' in updates) request.imageUrl = (updates as any).image;

    await adminApi.updateContent(id, request);

    await get().fetchContents();
  },

  deleteContent: async (id: number) => {
    const adminApi = new AdminApi();
    await adminApi.deleteContent({
      ids: [id],
      force: false,
    });

    await get().fetchContents();
  },

  setSelectedType: (type: ContentType | 'all') => {
    set({ selectedType: type });
  },

  getFilteredContents: () => {
    const { data, selectedType } = get();
    if (!data) return [];

    if (selectedType === 'all') {
      return data.content;
    }

    return data.content.filter(content => content.type === selectedType);
  }
}));
