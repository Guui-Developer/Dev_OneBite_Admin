import { useState } from 'react';
import type { MouseEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './CategoryManagement.css';

interface Group {
  groupKey: string;
  groupLabel: string;
  icon: string;
}

interface Category {
  key: string;
  label: string;
  groupKey: string;
  icon: string;
  count: number;
}

export default function CategoryManagement() {
  const [groups, setGroups] = useState<Group[]>([
    { groupKey: 'common', groupLabel: '공통', icon: 'https://cdn.simpleicons.org/files/gray' },
    { groupKey: 'language', groupLabel: '언어', icon: 'https://cdn.simpleicons.org/files/red' },
    { groupKey: 'frontend', groupLabel: '프론트엔드', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
    { groupKey: 'backend', groupLabel: '백엔드', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
    { groupKey: 'database', groupLabel: '데이터베이스', icon: 'https://cdn.simpleicons.org/files/green' },
    { groupKey: 'cloud', groupLabel: '클라우드', icon: 'https://cdn.simpleicons.org/icloud/gray' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { key: 'git', label: 'Git', groupKey: 'common', icon: 'https://cdn.simpleicons.org/git/F05032', count: 45 },
    { key: 'docker', label: 'Docker', groupKey: 'common', icon: 'https://cdn.simpleicons.org/docker/2496ED', count: 38 },
    { key: 'linux', label: 'Linux', groupKey: 'common', icon: 'https://cdn.simpleicons.org/linux/FCC624', count: 52 },
    { key: 'javascript', label: 'JavaScript', groupKey: 'language', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', count: 67 },
    { key: 'typescript', label: 'TypeScript', groupKey: 'language', icon: 'https://cdn.simpleicons.org/typescript/3178C6', count: 54 },
    { key: 'python', label: 'Python', groupKey: 'language', icon: 'https://cdn.simpleicons.org/python/3776AB', count: 58 },
    { key: 'react', label: 'React', groupKey: 'frontend', icon: 'https://cdn.simpleicons.org/react/61DAFB', count: 89 },
    { key: 'vue', label: 'Vue', groupKey: 'frontend', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', count: 43 },
    { key: 'spring', label: 'Spring', groupKey: 'backend', icon: 'https://cdn.simpleicons.org/spring/6DB33F', count: 72 },
    { key: 'nodejs', label: 'Node.js', groupKey: 'backend', icon: 'https://cdn.simpleicons.org/nodedotjs/339933', count: 64 },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<string>('common');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const handleDeleteGroup = (groupKey: string) => {
    if (confirm(`"${groupKey}" 그룹을 삭제하시겠습니까?\n연관된 카테고리도 함께 삭제됩니다.`)) {
      setGroups(groups.filter(g => g.groupKey !== groupKey));
      setCategories(categories.filter(c => c.groupKey !== groupKey));
      if (selectedGroup === groupKey) {
        setSelectedGroup(groups[0]?.groupKey || '');
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

  const handleDeleteCategory = (key: string) => {
    if (confirm(`"${key}" 카테고리를 삭제하시겠습니까?`)) {
      setCategories(categories.filter(c => c.key !== key));
    }
  };

  const handleGroupSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // API 호출 예정
    console.log('Submit group:', editingGroup);
    setShowGroupModal(false);
  };

  const handleCategorySubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // API 호출 예정
    console.log('Submit category:', editingCategory);
    setShowCategoryModal(false);
  };

  const editingGroupData = editingGroup ? groups.find(g => g.groupKey === editingGroup) : null;
  const editingCategoryData = editingCategory ? categories.find(c => c.key === editingCategory) : null;

  return (
    <div className="category-management">
      <div className="management-header">
        <h1>그룹 & 카테고리 관리</h1>
        <div className="header-info">
          <span>{groups.length}개 그룹</span>
          <span>•</span>
          <span>{categories.length}개 카테고리</span>
        </div>
      </div>

      <div className="management-content">
        {/* 좌측: 그룹 목록 */}
        <div className="groups-panel">
          <div className="panel-header">
            <h2>그룹</h2>
            <button className="btn-icon" onClick={handleAddGroup} title="그룹 추가">
              <FiPlus />
            </button>
          </div>
          <div className="groups-list">
            {groups.map((group) => (
              <div
                key={group.groupKey}
                className={`group-card ${selectedGroup === group.groupKey ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group.groupKey)}
              >
                <div className="group-info">
                  <img src={group.icon} alt={group.groupLabel} className="group-icon" />
                  <div className="group-details">
                    <h3>{group.groupLabel}</h3>
                    <span className="group-key">{group.groupKey}</span>
                  </div>
                  <span className="group-count">
                    {categories.filter(c => c.groupKey === group.groupKey).length}
                  </span>
                </div>
                <div className="group-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-action btn-edit" onClick={() => handleEditGroup(group.groupKey)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDeleteGroup(group.groupKey)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 카테고리 목록 */}
        <div className="categories-panel">
          <div className="panel-header">
            <h2>{selectedGroupData?.groupLabel} 카테고리</h2>
            <button className="btn-icon" onClick={handleAddCategory} title="카테고리 추가">
              <FiPlus />
            </button>
          </div>
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div key={category.key} className="category-card">
                <div className="category-header">
                  <img src={category.icon} alt={category.label} className="category-icon" />
                  <div className="category-info">
                    <h3>{category.label}</h3>
                    <span className="category-key">{category.key}</span>
                  </div>
                  <span className="category-count">{category.count}</span>
                </div>
                <div className="category-actions">
                  <button className="btn-action btn-edit" onClick={() => handleEditCategory(category.key)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDeleteCategory(category.key)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="empty-state">
                <p>이 그룹에 카테고리가 없습니다</p>
                <button className="btn-primary" onClick={handleAddCategory}>
                  카테고리 추가
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 그룹 모달 */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGroupData ? '그룹 수정' : '그룹 추가'}</h2>
              <button className="modal-close" onClick={() => setShowGroupModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>그룹 키 *</label>
                <input
                  type="text"
                  placeholder="예: cloud"
                  defaultValue={editingGroupData?.groupKey}
                />
                <span className="form-hint">영문 소문자로 입력하세요</span>
              </div>
              <div className="form-group">
                <label>그룹명 *</label>
                <input
                  type="text"
                  placeholder="예: 클라우드"
                  defaultValue={editingGroupData?.groupLabel}
                />
              </div>
              <div className="form-group">
                <label>아이콘 URL *</label>
                <input
                  type="text"
                  placeholder="https://cdn.simpleicons.org/..."
                  defaultValue={editingGroupData?.icon}
                />
                {editingGroupData && (
                  <div className="icon-preview-box">
                    <img src={editingGroupData.icon} alt="preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowGroupModal(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleGroupSubmit}>
                {editingGroupData ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 모달 */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategoryData ? '카테고리 수정' : '카테고리 추가'}</h2>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>그룹 *</label>
                <select defaultValue={editingCategoryData?.groupKey || selectedGroup}>
                  {groups.map((group) => (
                    <option key={group.groupKey} value={group.groupKey}>
                      {group.groupLabel}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>카테고리 키 *</label>
                <input
                  type="text"
                  placeholder="예: nextjs"
                  defaultValue={editingCategoryData?.key}
                />
                <span className="form-hint">영문 소문자로 입력하세요</span>
              </div>
              <div className="form-group">
                <label>카테고리명 *</label>
                <input
                  type="text"
                  placeholder="예: Next.js"
                  defaultValue={editingCategoryData?.label}
                />
              </div>
              <div className="form-group">
                <label>아이콘 URL *</label>
                <input
                  type="text"
                  placeholder="https://cdn.simpleicons.org/..."
                  defaultValue={editingCategoryData?.icon}
                />
                {editingCategoryData && (
                  <div className="icon-preview-box">
                    <img src={editingCategoryData.icon} alt="preview" />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCategoryModal(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleCategorySubmit}>
                {editingCategoryData ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
