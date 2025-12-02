import { create } from 'zustand';
import type {
  LearningData,
  GetLearningDataListData,
  ContentType
} from '@/api/model/response/content_types';
import { mockContentListData } from '@/api/mockData';
// import { ContentApi } from '@/api/modules/ContentApi'; // 실제 API 사용 시

interface ContentStore {
  // State
  data: GetLearningDataListData | null;
  isLoading: boolean;
  error: string | null;
  selectedType: ContentType | 'all';

  // Actions
  fetchContents: (params?: { categories?: string; limit?: number; lastSeenId?: number }) => Promise<void>;
  addContent: (content: LearningData) => void;
  updateContent: (id: number, updates: Partial<LearningData>) => void;
  deleteContent: (id: number) => void;
  setSelectedType: (type: ContentType | 'all') => void;
  getFilteredContents: () => LearningData[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  // Initial State
  data: null,
  isLoading: false,
  error: null,
  selectedType: 'all',

  // Fetch contents from API (currently using mock data)
  fetchContents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));

      // 실제 API 사용 시:
      // const data = await ContentApi.getContentList({
      //   categories: params.categories,
      //   limit: params.limit || 10,
      //   lastSeenId: params.lastSeenId
      // });

      set({
        data: mockContentListData,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch contents',
        isLoading: false
      });
    }
  },

  // Add a new content
  addContent: (content: LearningData) => {
    const { data } = get();
    if (!data) return;

    set({
      data: {
        ...data,
        content: [content, ...data.content],
        pagination: {
          ...data.pagination,
          total: data.pagination.total + 1,
          returnedCount: data.pagination.returnedCount + 1
        }
      }
    });
  },

  // Update an existing content
  updateContent: (id: number, updates: Partial<LearningData>) => {
    const { data } = get();
    if (!data) return;

    const updatedContent = data.content.map(content => {
      if (content.id === id) {
        return { ...content, ...updates } as LearningData;
      }
      return content;
    });

    set({
      data: {
        ...data,
        content: updatedContent
      }
    });
  },

  // Delete a content
  deleteContent: (id: number) => {
    const { data } = get();
    if (!data) return;

    const updatedContent = data.content.filter(content => content.id !== id);

    set({
      data: {
        ...data,
        content: updatedContent,
        pagination: {
          ...data.pagination,
          total: data.pagination.total - 1,
          returnedCount: data.pagination.returnedCount - 1
        }
      }
    });
  },

  // Set selected type filter
  setSelectedType: (type: ContentType | 'all') => {
    set({ selectedType: type });
  },

  // Get filtered contents based on selected type
  getFilteredContents: () => {
    const { data, selectedType } = get();
    if (!data) return [];

    if (selectedType === 'all') {
      return data.content;
    }

    return data.content.filter(content => content.type === selectedType);
  }
}));
