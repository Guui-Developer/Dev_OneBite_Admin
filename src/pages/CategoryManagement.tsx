import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';

const FiPlus = Plus;
const FiEdit2 = Edit2;
const FiTrash2 = Trash2;

export default function CategoryManagement() {
  const { data, isLoading, fetchCategories, deleteCategory, deleteGroup, addCategory, updateCategory, addGroup, updateGroup } = useCategoryStore();

  const [selectedGroup, setSelectedGroup] = useState<string>('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const groups = data?.groups || [];
  const categories = groups.flatMap(g => g.categories.map(c => ({ ...c, groupKey: g.groupKey })));
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const selectedGroupData = groups.find(g => g.groupKey === selectedGroup);
  const filteredCategories = categories.filter(c => c.groupKey === selectedGroup);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setShowGroupModal(true);
  };

  const handleEditGroup = (groupKey: string) => {
    setEditingGroup(groupKey);
    setShowGroupModal(true);
  };

  const handleDeleteGroup = async (groupKey: string) => {
    if (confirm(`"${groupKey}" 그룹을 삭제하시겠습니까?\n연관된 카테고리도 함께 삭제됩니다.`)) {
      try {
        await deleteGroup(groupKey);
        if (selectedGroup === groupKey) {
          setSelectedGroup(groups[0]?.groupKey || '');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (key: string) => {
    setEditingCategory(key);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (key: string) => {
    if (confirm(`"${key}" 카테고리를 삭제하시겠습니까?`)) {
      try {
        await deleteCategory(key);
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const handleGroupSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = (e.target as HTMLButtonElement).closest('form') || (e.target as HTMLButtonElement).parentElement?.parentElement;
      if (!form) return;

      const groupKeyInput = form.querySelector<HTMLInputElement>('input[placeholder*="cloud"]');
      const groupLabelInput = form.querySelector<HTMLInputElement>('input[placeholder*="클라우드"]');
      const iconUrlInput = form.querySelector<HTMLInputElement>('input[placeholder*="cdn.simpleicons"]');

      if (!groupKeyInput || !groupLabelInput || !iconUrlInput) return;

      const groupKey = groupKeyInput.value.trim();
      const groupLabel = groupLabelInput.value.trim();
      const iconUrl = iconUrlInput.value.trim();

      if (!groupKey || !groupLabel || !iconUrl) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      if (editingGroupData) {
        await updateGroup(editingGroup!, {
          groupLabel,
          icon: iconUrl,
        });
      } else {
        await addGroup({
          groupKey,
          groupLabel,
          icon: iconUrl,
        });
      }

      setShowGroupModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = (e.target as HTMLButtonElement).closest('form') || (e.target as HTMLButtonElement).parentElement?.parentElement;
      if (!form) return;

      const groupSelect = form.querySelector<HTMLSelectElement>('select');
      const categoryKeyInput = form.querySelector<HTMLInputElement>('input[placeholder*="nextjs"]');
      const categoryLabelInput = form.querySelector<HTMLInputElement>('input[placeholder*="Next.js"]');
      const iconUrlInput = form.querySelector<HTMLInputElement>('input[placeholder*="cdn.simpleicons"]');

      if (!groupSelect || !categoryKeyInput || !categoryLabelInput || !iconUrlInput) return;

      const targetGroupKey = groupSelect.value;
      const categoryKey = categoryKeyInput.value.trim();
      const categoryLabel = categoryLabelInput.value.trim();
      const iconUrl = iconUrlInput.value.trim();

      if (!categoryKey || !categoryLabel || !iconUrl) {
        alert('모든 필드를 입력해주세요.');
        return;
      }

      if (editingCategoryData) {
        await updateCategory(editingCategory!, {
          label: categoryLabel,
          icon: iconUrl,
        });
      } else {
        await addCategory(targetGroupKey, {
          key: categoryKey,
          label: categoryLabel,
          icon: iconUrl,
        });
      }

      setShowCategoryModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGroupCheck = (groupKey: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(k => k !== groupKey)
        : [...prev, groupKey]
    );
  };

  const handleGroupSelectAll = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map(g => g.groupKey));
    }
  };

  const handleDeleteSelectedGroups = async () => {
    if (selectedGroups.length === 0) return;
    if (confirm(`선택한 ${selectedGroups.length}개의 그룹을 삭제하시겠습니까?\n연관된 카테고리도 함께 삭제됩니다.`)) {
      try {
        for (const key of selectedGroups) {
          await deleteGroup(key);
        }
        setSelectedGroups([]);
        if (selectedGroups.includes(selectedGroup)) {
          setSelectedGroup(groups[0]?.groupKey || '');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const handleCategoryCheck = (categoryKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleCategorySelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(c => c.key));
    }
  };

  const handleDeleteSelectedCategories = async () => {
    if (selectedCategories.length === 0) return;
    if (confirm(`선택한 ${selectedCategories.length}개의 카테고리를 삭제하시겠습니까?`)) {
      try {
        for (const key of selectedCategories) {
          await deleteCategory(key);
        }
        setSelectedCategories([]);
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const editingGroupData = editingGroup ? groups.find(g => g.groupKey === editingGroup) : null;
  const editingCategoryData = editingCategory ? categories.find(c => c.key === editingCategory) : null;

  if (isLoading) {
    return (
      <div className="max-w-[1400px] flex items-center justify-center py-20">
        <div className="text-gray-400 text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px]">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-50">그룹 & 카테고리 관리</h1>
        <div className="flex items-center gap-3 text-gray-400">
          <span>{groups.length}개 그룹</span>
          <span>•</span>
          <span>{data?.totalCategories || 0}개 카테고리</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-grow-[1] bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-50 m-0">그룹</h2>
            <button
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              onClick={handleAddGroup}
              title="그룹 추가"
            >
              <FiPlus />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedGroups.length === groups.length && groups.length > 0}
                onChange={handleGroupSelectAll}
                className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300">
                전체 선택 {selectedGroups.length > 0 && `(${selectedGroups.length}/${groups.length})`}
              </span>
            </label>
            {selectedGroups.length > 0 && (
              <button
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                onClick={handleDeleteSelectedGroups}
              >
                <FiTrash2 size={14} />
                선택 삭제
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <div
                key={group.groupKey}
                className={`p-4 rounded-lg border transition-all ${
                  selectedGroup === group.groupKey
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.groupKey)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleGroupCheck(group.groupKey);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                  />
                  <img
                    src={group.icon}
                    alt={group.groupLabel}
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => setSelectedGroup(group.groupKey)}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedGroup(group.groupKey)}>
                    <h3 className="text-gray-50 font-semibold m-0 mb-1">{group.groupLabel}</h3>
                    <span className="text-gray-400 text-sm">{group.groupKey}</span>
                  </div>
                  <span className="px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm font-semibold">
                    {group.categories.length}
                  </span>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-gray-600 hover:bg-gray-500 text-gray-200 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleEditGroup(group.groupKey)}
                  >
                    <FiEdit2 size={14} />
                    <span className="text-sm">수정</span>
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleDeleteGroup(group.groupKey)}
                  >
                    <FiTrash2 size={14} />
                    <span className="text-sm">삭제</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-grow-[2] bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-50 m-0">{selectedGroupData?.groupLabel} 카테고리</h2>
            <button
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              onClick={handleAddCategory}
              title="카테고리 추가"
            >
              <FiPlus />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                onChange={handleCategorySelectAll}
                className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300">
                전체 선택 {selectedCategories.length > 0 && `(${selectedCategories.length}/${filteredCategories.length})`}
              </span>
            </label>
            {selectedCategories.length > 0 && (
              <button
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                onClick={handleDeleteSelectedCategories}
              >
                <FiTrash2 size={14} />
                선택 삭제
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <div key={category.key} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.key)}
                    onChange={() => handleCategoryCheck(category.key)}
                    className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                  />
                  <img src={category.icon} alt={category.label} className="w-10 h-10" />
                  <div className="flex-1">
                    <h3 className="text-gray-50 font-semibold m-0 mb-1">{category.label}</h3>
                    <span className="text-gray-400 text-sm">{category.key}</span>
                  </div>
                  <span className="px-2 py-1 bg-gray-800 rounded text-gray-300 text-sm font-semibold">{category.count}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded bg-gray-600 hover:bg-gray-500 text-gray-200 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleEditCategory(category.key)}
                  >
                    <FiEdit2 size={14} />
                    <span className="text-sm">수정</span>
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleDeleteCategory(category.key)}
                  >
                    <FiTrash2 size={14} />
                    <span className="text-sm">삭제</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-12 text-gray-400">
                <p className="mb-4">이 그룹에 카테고리가 없습니다</p>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                  onClick={handleAddCategory}
                >
                  카테고리 추가
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGroupModal(false)}>
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-50 m-0">{editingGroupData ? '그룹 수정' : '그룹 추가'}</h2>
              <button
                className="text-gray-400 hover:text-gray-200 text-3xl leading-none transition-colors"
                onClick={() => setShowGroupModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">그룹 키 *</label>
                <input
                  type="text"
                  placeholder="예: cloud"
                  defaultValue={editingGroupData?.groupKey}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
                <span className="text-gray-500 text-xs mt-1 block">영문 소문자로 입력하세요</span>
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">그룹명 *</label>
                <input
                  type="text"
                  placeholder="예: 클라우드"
                  defaultValue={editingGroupData?.groupLabel}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">아이콘 URL *</label>
                <input
                  type="text"
                  placeholder="https://cdn.simpleicons.org/..."
                  defaultValue={editingGroupData?.icon}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
                {editingGroupData && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg flex items-center justify-center">
                    <img src={editingGroupData.icon} alt="preview" className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                className="flex-1 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                onClick={() => setShowGroupModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleGroupSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : (editingGroupData ? '수정' : '추가')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCategoryModal(false)}>
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-50 m-0">{editingCategoryData ? '카테고리 수정' : '카테고리 추가'}</h2>
              <button
                className="text-gray-400 hover:text-gray-200 text-3xl leading-none transition-colors"
                onClick={() => setShowCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">그룹 *</label>
                <select
                  defaultValue={editingCategoryData?.groupKey || selectedGroup}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                >
                  {groups.map((group) => (
                    <option key={group.groupKey} value={group.groupKey}>
                      {group.groupLabel}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">카테고리 키 *</label>
                <input
                  type="text"
                  placeholder="예: nextjs"
                  defaultValue={editingCategoryData?.key}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
                <span className="text-gray-500 text-xs mt-1 block">영문 소문자로 입력하세요</span>
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">카테고리명 *</label>
                <input
                  type="text"
                  placeholder="예: Next.js"
                  defaultValue={editingCategoryData?.label}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">아이콘 URL *</label>
                <input
                  type="text"
                  placeholder="https://cdn.simpleicons.org/..."
                  defaultValue={editingCategoryData?.icon}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
                {editingCategoryData && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg flex items-center justify-center">
                    <img src={editingCategoryData.icon} alt="preview" className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                className="flex-1 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                onClick={() => setShowCategoryModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleCategorySubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : (editingCategoryData ? '수정' : '추가')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
