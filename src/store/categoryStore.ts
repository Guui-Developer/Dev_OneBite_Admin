import { create } from 'zustand';
import type { CategoriesData, CategoryGroup, Category } from '@/api/model/response/category';
import type { CategoryGroupDto } from '@/api/model/response/group';
import type { CategoryDto } from '@/api/model/response/admin-category';
import { PublicApi } from '@/api/modules/PublicApi';
import { AdminApi } from '@/api/modules/AdminApi';

// 메타데이터를 포함한 확장된 타입
interface CategoryWithMeta extends Category {
  categoryId?: number;
  categoryGroupId?: number;
}

interface CategoryGroupWithMeta extends CategoryGroup {
  groupId?: number;
  categories: CategoryWithMeta[];
}

interface CategoriesDataWithMeta extends CategoriesData {
  groups: CategoryGroupWithMeta[];
}

interface CategoryStore {
  // State
  data: CategoriesDataWithMeta | null;
  groupMetadata: Map<string, CategoryGroupDto>;
  categoryMetadata: Map<string, CategoryDto>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (groupKey: string, categoryData: { key: string; label: string; icon: string }) => Promise<void>;
  updateCategory: (categoryKey: string, updates: { label?: string; icon?: string }) => Promise<void>;
  deleteCategory: (categoryKey: string) => Promise<void>;
  addGroup: (groupData: { groupKey: string; groupLabel: string; icon: string }) => Promise<void>;
  updateGroup: (groupKey: string, updates: { groupLabel?: string; icon?: string }) => Promise<void>;
  deleteGroup: (groupKey: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  // Initial State
  data: null,
  groupMetadata: new Map(),
  categoryMetadata: new Map(),
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const publicApi = new PublicApi();
      const adminApi = new AdminApi();

      // PublicApi로 화면 표시용 데이터 가져오기
      const publicData = await publicApi.getCategories();

      // AdminApi로 메타데이터 가져오기 (페이지네이션)
      const [groupsResponse, categoriesResponse] = await Promise.all([
        adminApi.getCategoryGroups({ size: 1000 }),
        adminApi.getCategories({ size: 1000 }),
      ]);

      // 메타데이터 맵 생성
      const groupMetadata = new Map<string, CategoryGroupDto>();
      groupsResponse.content.forEach((group) => {
        groupMetadata.set(group.groupCode, group);
      });

      const categoryMetadata = new Map<string, CategoryDto>();
      categoriesResponse.content.forEach((category) => {
        categoryMetadata.set(category.code, category);
      });

      // 데이터 병합: PublicApi 데이터에 AdminApi 메타데이터 추가
      const mergedData: CategoriesDataWithMeta = {
        ...publicData,
        groups: publicData.groups.map((group) => {
          const meta = groupMetadata.get(group.groupKey);
          return {
            ...group,
            groupId: meta?.groupId,
            categories: group.categories.map((category) => {
              const catMeta = categoryMetadata.get(category.key);
              return {
                ...category,
                categoryId: catMeta?.categoryId,
                categoryGroupId: catMeta?.categoryGroupId,
              };
            }),
          };
        }),
      };

      set({
        data: mergedData,
        groupMetadata,
        categoryMetadata,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  // Add a new category to a group
  addCategory: async (groupKey: string, categoryData: { key: string; label: string; icon: string }) => {
    const { groupMetadata, fetchCategories } = get();
    const groupMeta = groupMetadata.get(groupKey);
    if (!groupMeta) throw new Error('Group not found');

    const adminApi = new AdminApi();
    await adminApi.createCategory({
      code: categoryData.key,
      label: categoryData.label,
      categoryGroupId: groupMeta.groupId,
      iconUrl: categoryData.icon,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  },

  // Update an existing category
  updateCategory: async (categoryKey: string, updates: { label?: string; icon?: string }) => {
    const { categoryMetadata, fetchCategories } = get();
    const categoryMeta = categoryMetadata.get(categoryKey);
    if (!categoryMeta) throw new Error('Category not found');

    const adminApi = new AdminApi();
    await adminApi.updateCategory(categoryMeta.categoryId, {
      categoryGroupId: categoryMeta.categoryGroupId,
      code: categoryMeta.code,
      label: updates.label ?? categoryMeta.label,
      iconUrl: updates.icon ?? categoryMeta.iconUrl ?? undefined,
      displayOrder: categoryMeta.displayOrder ?? 0,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  },

  // Delete a category
  deleteCategory: async (categoryKey: string) => {
    const { categoryMetadata, fetchCategories } = get();
    const categoryMeta = categoryMetadata.get(categoryKey);
    if (!categoryMeta) throw new Error('Category not found');

    const adminApi = new AdminApi();
    await adminApi.deleteCategories({
      ids: [categoryMeta.categoryId],
      force: false,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  },

  // Add a new group
  addGroup: async (groupData: { groupKey: string; groupLabel: string; icon: string }) => {
    const { fetchCategories } = get();

    const adminApi = new AdminApi();
    await adminApi.createCategoryGroup({
      groupCode: groupData.groupKey,
      groupLabel: groupData.groupLabel,
      iconUrl: groupData.icon,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  },

  // Update an existing group
  updateGroup: async (groupKey: string, updates: { groupLabel?: string; icon?: string }) => {
    const { groupMetadata, fetchCategories } = get();
    const groupMeta = groupMetadata.get(groupKey);
    if (!groupMeta) throw new Error('Group not found');

    const adminApi = new AdminApi();
    await adminApi.updateCategoryGroup(groupMeta.groupId, {
      groupCode: groupMeta.groupCode,
      groupLabel: updates.groupLabel ?? groupMeta.groupLabel,
      iconUrl: updates.icon ?? groupMeta.iconUrl ?? undefined,
      displayOrder: groupMeta.displayOrder ?? 0,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  },

  // Delete a group and its categories
  deleteGroup: async (groupKey: string) => {
    const { groupMetadata, fetchCategories } = get();
    const groupMeta = groupMetadata.get(groupKey);
    if (!groupMeta) throw new Error('Group not found');

    const adminApi = new AdminApi();
    await adminApi.deleteCategoryGroups({
      ids: [groupMeta.groupId],
      force: true,
    });

    // 변경 후 PublicApi 다시 호출
    await fetchCategories();
  }
}));

// Legacy compatibility function for ContentCard
export const categoryStore = () => {
  const store = useCategoryStore.getState();
  return {
    categories: store.data?.groups || []
  };
};
