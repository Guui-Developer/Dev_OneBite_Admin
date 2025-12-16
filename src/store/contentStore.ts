import { create } from 'zustand';
import type {
    Content as LearningData,
    ContentType
} from '@/api/model/public/response/content_types';
import type { ContentDto } from '@/api/model/admin/response/content';
import { AdminApi } from '@/api/modules/AdminApi';
import type {CreateContentRequest} from "@/api/model/admin/request/content.ts";

interface GetLearningDataListData {
    content: LearningData[];
    pagination: {
        total: number;
        returnedCount: number;
        hasNext: boolean;
    };
}

interface UpdateContentRequest {
    title?: string;
    code?: string;
    description?: string;
    answer?: string;
    beforeCode?: string;
    afterCode?: string;
    feedback?: string;
    question?: string;
    imageUrl?: string;
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
    deleteContents: (ids: number[]) => Promise<void>;
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
                size: params?.size || 100,
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

        const request: CreateContentRequest = {
            type: content.type,
            title: content.title,
        };

        switch (content.type) {
            case 'code_tip':
                request.code = content.code;
                request.description = content.description;
                break;
            case 'bug_challenge':
                request.code = content.code;
                request.answer = content.answer;
                break;
            case 'code_review':
                request.beforeCode = content.before;
                request.afterCode = content.after;
                request.feedback = content.feedback;
                break;
            case 'interview':
                request.question = content.question;
                request.answer = content.answer;
                break;
            case 'meme':
                request.imageUrl = content.image;
                request.description = content.description;
                break;
        }

        await adminApi.createContent(request);
    },

    updateContent: async (id: number, updates: Partial<LearningData>) => {
        const adminApi = new AdminApi();

        const request: UpdateContentRequest = {};

        if (updates.title) request.title = updates.title;

        if ('code' in updates && updates.code !== undefined) request.code = updates.code;
        if ('description' in updates && updates.description !== undefined) request.description = updates.description;
        if ('answer' in updates && updates.answer !== undefined) request.answer = updates.answer;
        if ('before' in updates && updates.before !== undefined) request.beforeCode = updates.before;
        if ('after' in updates && updates.after !== undefined) request.afterCode = updates.after;
        if ('feedback' in updates && updates.feedback !== undefined) request.feedback = updates.feedback;
        if ('question' in updates && updates.question !== undefined) request.question = updates.question;
        if ('image' in updates && updates.image !== undefined) request.imageUrl = updates.image;

        await adminApi.updateContent(id, request);
    },

    deleteContent: async (id: number) => {
        const adminApi = new AdminApi();
        await adminApi.deleteContent({
            ids: [id],
            force: false,
        });
    },

    deleteContents: async (ids: number[]) => {
        if (ids.length === 0) return;

        const adminApi = new AdminApi();
        await adminApi.deleteContent({
            ids,
            force: false,
        });
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