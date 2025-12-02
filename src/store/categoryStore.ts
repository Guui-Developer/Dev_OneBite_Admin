import { create } from 'zustand';
import type { CategoriesData, CategoryGroup, Category } from '@/api/model/response/category';
import { mockCategoriesData } from '@/api/mockData';
// import { CategoriesApi } from '@/api/modules/CategoriesApi'; // 실제 API 사용 시

interface CategoryStore {
  // State
  data: CategoriesData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (groupKey: string, category: Omit<Category, 'count'>) => void;
  updateCategory: (categoryKey: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryKey: string) => void;
  addGroup: (group: CategoryGroup) => void;
  updateGroup: (groupKey: string, updates: Partial<CategoryGroup>) => void;
  deleteGroup: (groupKey: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  // Initial State
  data: null,
  isLoading: false,
  error: null,

  // Fetch categories from API (currently using mock data)
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));

      // 실제 API 사용 시:
      // const data = await CategoriesApi.getCategories();

      set({
        data: mockCategoriesData,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false
      });
    }
  },

  // Add a new category to a group
  addCategory: (groupKey: string, category: Omit<Category, 'count'>) => {
    const { data } = get();
    if (!data) return;

    const newCategory: Category = { ...category, count: 0 };
    const updatedGroups = data.groups.map(group => {
      if (group.groupKey === groupKey) {
        return {
          ...group,
          categories: [...group.categories, newCategory]
        };
      }
      return group;
    });

    set({
      data: {
        ...data,
        groups: updatedGroups,
        totalCategories: data.totalCategories + 1
      }
    });
  },

  // Update an existing category
  updateCategory: (categoryKey: string, updates: Partial<Category>) => {
    const { data } = get();
    if (!data) return;

    const updatedGroups = data.groups.map(group => ({
      ...group,
      categories: group.categories.map(cat =>
        cat.key === categoryKey ? { ...cat, ...updates } : cat
      )
    }));

    set({
      data: {
        ...data,
        groups: updatedGroups
      }
    });
  },

  // Delete a category
  deleteCategory: (categoryKey: string) => {
    const { data } = get();
    if (!data) return;

    const updatedGroups = data.groups.map(group => ({
      ...group,
      categories: group.categories.filter(cat => cat.key !== categoryKey)
    }));

    set({
      data: {
        ...data,
        groups: updatedGroups,
        totalCategories: data.totalCategories - 1
      }
    });
  },

  // Add a new group
  addGroup: (group: CategoryGroup) => {
    const { data } = get();
    if (!data) return;

    set({
      data: {
        ...data,
        groups: [...data.groups, group]
      }
    });
  },

  // Update an existing group
  updateGroup: (groupKey: string, updates: Partial<CategoryGroup>) => {
    const { data } = get();
    if (!data) return;

    const updatedGroups = data.groups.map(group =>
      group.groupKey === groupKey ? { ...group, ...updates } : group
    );

    set({
      data: {
        ...data,
        groups: updatedGroups
      }
    });
  },

  // Delete a group and its categories
  deleteGroup: (groupKey: string) => {
    const { data } = get();
    if (!data) return;

    const deletedGroup = data.groups.find(g => g.groupKey === groupKey);
    const categoriesDeleted = deletedGroup?.categories.length || 0;

    set({
      data: {
        ...data,
        groups: data.groups.filter(g => g.groupKey !== groupKey),
        totalCategories: data.totalCategories - categoriesDeleted
      }
    });
  }
}));

// Legacy compatibility function for ContentCard
export const categoryStore = () => {
  const store = useCategoryStore.getState();
  return {
    categories: store.data?.groups || []
  };
};
