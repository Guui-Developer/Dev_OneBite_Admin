// GET /categories 응답
export interface CategoryResponseData {
    success: boolean;
    data: CategoriesData;
}

export interface CategoriesData {
    groups: CategoryGroup[];
    totalCategories: number;
    totalContent: number;
}

export interface CategoryGroup {
    groupLabel: string;
    groupKey: string;
    icon: string;
    categories: Category[];
}

export interface Category {
    label: string;
    key: string;
    icon: string;
    count: number;
}

// POST /categories 응답 데이터
export interface CreatedCategoryData {
    groupKey: string;
    label: string;
    key: string;
    icon: string;
    count: number;
    createdAt: string;
}

// POST /categories 응답
export interface CreateCategoryResponse {
    success: true;
    data: CreatedCategoryData;
    message: string;
}
