export interface Category {
  label: string;
  key: string;
  icon: string;
  count: number;
}

export interface CategoryGroup {
  groupLabel: string;
  groupKey: string;
  icon: string;
  categories: Category[];
}

export interface CategoriesData {
  groups: CategoryGroup[];
  totalCategories: number;
  totalContent: number;
}
