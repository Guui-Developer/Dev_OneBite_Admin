import { create } from 'zustand';
import type { CategoriesData, CategoryGroup, Category } from '@/api/model/response/category';
import type { CategoryGroupDto } from '@/api/model/response/group';
import type { CategoryDto } from '@/api/model/response/admin-category';
import { PublicApi } from '@/api/modules/PublicApi';
import { AdminApi } from '@/api/modules/AdminApi';

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
  data: CategoriesDataWithMeta | null;
  groupMetadata: Map<string, CategoryGroupDto>;
  categoryMetadata: Map<string, CategoryDto>;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  addCategory: (groupKey: string, categoryData: { key: string; label: string; icon: string }) => Promise<void>;
  updateCategory: (categoryKey: string, updates: { label?: string; icon?: string }) => Promise<void>;
  deleteCategory: (categoryKey: string) => Promise<void>;
  addGroup: (groupData: { groupKey: string; groupLabel: string; icon: string }) => Promise<void>;
  updateGroup: (groupKey: string, updates: { groupLabel?: string; icon?: string }) => Promise<void>;
  deleteGroup: (groupKey: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
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
      const publicData = await publicApi.getCategories();
      const [groupsResponse, categoriesResponse] = await Promise.all([
        adminApi.getCategoryGroups({ size: 1000 }),
        adminApi.getCategories({ size: 1000 }),
      ]);

      const groupMetadata = new Map<string, CategoryGroupDto>();
      groupsResponse.content.forEach((group) => {
        groupMetadata.set(group.groupCode, group);
      });

      const categoryMetadata = new Map<string, CategoryDto>();
      categoriesResponse.content.forEach((category) => {
        categoryMetadata.set(category.code, category);
      });

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

    await fetchCategories();
  },

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

    await fetchCategories();
  },

  deleteCategory: async (categoryKey: string) => {
    const { categoryMetadata, fetchCategories } = get();
    const categoryMeta = categoryMetadata.get(categoryKey);
    if (!categoryMeta) throw new Error('Category not found');

    const adminApi = new AdminApi();
    await adminApi.deleteCategories({
      ids: [categoryMeta.categoryId],
      force: false,
    });

    await fetchCategories();
  },

  addGroup: async (groupData: { groupKey: string; groupLabel: string; icon: string }) => {
    const { fetchCategories } = get();

    const adminApi = new AdminApi();
    await adminApi.createCategoryGroup({
      groupCode: groupData.groupKey,
      groupLabel: groupData.groupLabel,
      iconUrl: groupData.icon,
    });

    await fetchCategories();
  },

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

    await fetchCategories();
  },

  deleteGroup: async (groupKey: string) => {
    const { groupMetadata, fetchCategories } = get();
    const groupMeta = groupMetadata.get(groupKey);
    if (!groupMeta) throw new Error('Group not found');

    const adminApi = new AdminApi();
    await adminApi.deleteCategoryGroups({
      ids: [groupMeta.groupId],
      force: true,
    });

    await fetchCategories();
  }
}));

export const categoryStore = () => {
  const store = useCategoryStore.getState();
  return {
    categories: store.data?.groups || []
  };
};
