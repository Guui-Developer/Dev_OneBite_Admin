import { create } from 'zustand';
import type {
    Content as LearningData,
    ContentType
} from '@/api/model/public/response/content_types';
import type { ContentDto } from '@/api/model/admin/response/content';
import { AdminApi } from '@/api/modules/AdminApi';
import type { CreateContentRequest, UpdateContentRequest } from "@/api/model/admin/request/content.ts";

interface GetLearningDataListData {
    content: LearningData[];
    pagination: {
        total: number;
        returnedCount: number;
        hasNext: boolean;
    };
}

const convertContentDtoToLearningData = (dto: ContentDto): LearningData | null => {
    const base = {
        id: dto.id,
        type: dto.type as ContentType,
        title: dto.title,
        tags: dto.tags || [],
        createdAt: dto.createdAt,
        views: dto.views,
        bookmarks: dto.bookmarks,
    };

    try {
        switch (dto.type) {
            case 'code_tip':
                return {
                    ...base,
                    type: 'code_tip',
                    code: ('code' in dto ? dto.code : '') || '',
                    language: ('language' in dto ? dto.language : '') || 'javascript',
                    description: ('description' in dto ? dto.description : '') || '',
                };
            case 'bug_challenge':
                return {
                    ...base,
                    type: 'bug_challenge',
                    code: ('code' in dto ? dto.code : '') || '',
                    answer: ('answer' in dto ? dto.answer : '') || '',
                    language: ('language' in dto ? dto.language : '') || 'javascript',
                };
            case 'code_review':
                return {
                    ...base,
                    type: 'code_review',
                    before: ('before' in dto ? dto.before : '') || '',
                    after: ('after' in dto ? dto.after : '') || '',
                    feedback: ('feedback' in dto ? dto.feedback : '') || '',
                    language: ('language' in dto ? dto.language : '') || 'javascript',
                };
            case 'interview':
                return {
                    ...base,
                    type: 'interview',
                    question: ('question' in dto ? dto.question : '') || '',
                    answer: ('answer' in dto ? dto.answer : '') || '',
                    tails: ('tails' in dto ? dto.tails : []) || [],
                };
            case 'meme':
                return {
                    ...base,
                    type: 'meme',
                    image: ('image' in dto ? dto.image : '') || '',
                    description: ('description' in dto ? dto.description : '') || '',
                };
            default:
                console.warn(`Unknown content type: ${(dto as ContentDto).type}`, dto);
                return null;
        }
    } catch (error) {
        console.error('Error converting DTO:', error, dto);
        return null;
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

    fetchContents: async (params?: { page?: number; size?: number; keyword?: string; type?: string }) => {
        set({ isLoading: true, error: null });
        try {
            const adminApi = new AdminApi();
            const response = await adminApi.getContentList({
                page: params?.page || 0,
                size: params?.size || 100000,
                keyword: params?.keyword,
                type: params?.type,
            });

            console.log('API Response:', response);

            const convertedContent = response.content
                .map(convertContentDtoToLearningData)
                .filter((item): item is LearningData => item !== null);

            console.log('Converted Content:', convertedContent);

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
            console.error('Fetch contents error:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch contents',
                isLoading: false,
            });
        }
    },

    addContent: async (content: LearningData) => {
        const adminApi = new AdminApi();

        let request: CreateContentRequest;

        switch (content.type) {
            case 'code_tip':
                request = {
                    type: 'code_tip',
                    title: content.title,
                    tags: content.tags,
                    code: content.code,
                    language: content.language || 'javascript',
                    description: content.description,
                };
                break;
            case 'bug_challenge':
                request = {
                    type: 'bug_challenge',
                    title: content.title,
                    tags: content.tags,
                    code: content.code,
                    answer: content.answer,
                    language: content.language || 'javascript',
                };
                break;
            case 'code_review':
                request = {
                    type: 'code_review',
                    title: content.title,
                    tags: content.tags,
                    before: content.before,
                    after: content.after,
                    feedback: content.feedback,
                    language: content.language || 'javascript',
                };
                break;
            case 'interview':
                request = {
                    type: 'interview',
                    title: content.title,
                    tags: content.tags,
                    question: content.question,
                    answer: content.answer,
                    tails: content.tails,
                };
                break;
            case 'meme':
                request = {
                    type: 'meme',
                    title: content.title,
                    tags: content.tags,
                    image: content.image,
                    description: content.description,
                };
                break;
        }

        await adminApi.createContent(request);
    },

    updateContent: async (id: number, updates: Partial<LearningData>) => {
        const adminApi = new AdminApi();

        if (!updates.type || !updates.title || !updates.tags) {
            throw new Error('Type, title, and tags are required for update');
        }

        let request: UpdateContentRequest;

        switch (updates.type) {
            case 'code_tip':
                if (!updates.code || !updates.description) {
                    throw new Error('Code and description are required for code_tip');
                }
                request = {
                    type: 'code_tip',
                    title: updates.title,
                    tags: updates.tags,
                    code: updates.code,
                    language: updates.language || 'javascript',
                    description: updates.description,
                };
                break;
            case 'bug_challenge':
                if (!updates.code || !updates.answer) {
                    throw new Error('Code and answer are required for bug_challenge');
                }
                request = {
                    type: 'bug_challenge',
                    title: updates.title,
                    tags: updates.tags,
                    code: updates.code,
                    answer: updates.answer,
                    language: updates.language || 'javascript',
                };
                break;
            case 'code_review':
                if (!updates.before || !updates.after || !updates.feedback) {
                    throw new Error('Before, after, and feedback are required for code_review');
                }
                request = {
                    type: 'code_review',
                    title: updates.title,
                    tags: updates.tags,
                    before: updates.before,
                    after: updates.after,
                    feedback: updates.feedback,
                    language: updates.language || 'javascript',
                };
                break;
            case 'interview':
                if (!updates.question || !updates.answer) {
                    throw new Error('Question and answer are required for interview');
                }
                request = {
                    type: 'interview',
                    title: updates.title,
                    tags: updates.tags,
                    question: updates.question,
                    answer: updates.answer,
                    tails: updates.tails,
                };
                break;
            case 'meme':
                if (!updates.image || !updates.description) {
                    throw new Error('Image and description are required for meme');
                }
                request = {
                    type: 'meme',
                    title: updates.title,
                    tags: updates.tags,
                    image: updates.image,
                    description: updates.description,
                };
                break;
            default:
                throw new Error(`Unknown content type: ${updates.type}`);
        }

        await adminApi.updateContent(id, request);
    },

    deleteContent: async (id: number) => {
        const adminApi = new AdminApi();
        await adminApi.deleteContent({
            ids: [id],
        });
    },

    deleteContents: async (ids: number[]) => {
        if (ids.length === 0) return;

        const adminApi = new AdminApi();
        await adminApi.deleteContent({
            ids,
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