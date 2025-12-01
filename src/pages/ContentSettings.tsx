import { useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './Settings.css';

interface ContentItem {
  id: number;
  type: 'code_tip' | 'bug_challenge' | 'code_review' | 'meme' | 'interview';
  title: string;
  tags: string[];
  createdAt: string;
}

// 더미 카테고리 데이터
const AVAILABLE_CATEGORIES = [
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'react', label: 'React' },
  { key: 'vue', label: 'Vue' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'spring', label: 'Spring' },
  { key: 'nodejs', label: 'Node.js' },
  { key: 'git', label: 'Git' },
  { key: 'docker', label: 'Docker' },
];

export default function ContentSettings() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [contents] = useState<ContentItem[]>([
    { id: 1, type: 'code_tip', title: '💡 옵셔널 체이닝', tags: ['javascript', 'typescript'], createdAt: '2024-11-25' },
    { id: 2, type: 'bug_challenge', title: '🐛 클로저 함정', tags: ['javascript'], createdAt: '2024-11-25' },
    { id: 3, type: 'interview', title: '🎯 호이스팅이란?', tags: ['javascript'], createdAt: '2024-11-25' },
    { id: 4, type: 'code_review', title: '👨‍💻 불필요한 삼항연산자', tags: ['javascript', 'react'], createdAt: '2024-11-25' },
    { id: 5, type: 'meme', title: '😂 세미콜론 논쟁', tags: ['javascript'], createdAt: '2024-11-25' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>('code_tip');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'code_tip', label: '코드 팁' },
    { key: 'bug_challenge', label: '버그 챌린지' },
    { key: 'code_review', label: '코드 리뷰' },
    { key: 'interview', label: '면접 질문' },
    { key: 'meme', label: '밈' },
  ];

  const filteredContents = activeTab === 'all'
    ? contents
    : contents.filter(c => c.type === activeTab);

  const handleAdd = () => {
    setEditingContent(null);
    setSelectedType('code_tip');
    setSelectedTags([]);
    setShowModal(true);
  };

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content);
    setSelectedType(content.type);
    setSelectedTags(content.tags);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(`ID ${id} 콘텐츠를 삭제하시겠습니까?`)) {
      console.log('Delete content:', id);
    }
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Submit:', { type: selectedType, tags: selectedTags });
    setShowModal(false);
  };

  const handleTagToggle = (categoryKey: string) => {
    setSelectedTags(prev =>
      prev.includes(categoryKey)
        ? prev.filter(t => t !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'code_tip':
        return (
          <>
            <div className="form-group">
              <label>코드 *</label>
              <textarea
                rows={6}
                placeholder="const example = () => {...}"
                className="code-textarea"
              />
            </div>
            <div className="form-group">
              <label>언어 *</label>
              <input
                type="text"
                placeholder="예: JavaScript"
              />
            </div>
            <div className="form-group">
              <label>설명 *</label>
              <textarea
                rows={3}
                placeholder="코드에 대한 설명을 입력하세요"
              />
            </div>
          </>
        );

      case 'bug_challenge':
        return (
          <>
            <div className="form-group">
              <label>문제 코드 *</label>
              <textarea
                rows={6}
                placeholder="버그가 있는 코드를 입력하세요"
                className="code-textarea"
              />
            </div>
            <div className="form-group">
              <label>정답/해설 *</label>
              <textarea
                rows={4}
                placeholder="버그의 원인과 해결 방법을 설명하세요"
              />
            </div>
          </>
        );

      case 'code_review':
        return (
          <>
            <div className="form-group">
              <label>개선 전 코드 *</label>
              <textarea
                rows={5}
                placeholder="개선 전 코드"
                className="code-textarea"
              />
            </div>
            <div className="form-group">
              <label>개선 후 코드 *</label>
              <textarea
                rows={5}
                placeholder="개선 후 코드"
                className="code-textarea"
              />
            </div>
            <div className="form-group">
              <label>피드백 *</label>
              <textarea
                rows={3}
                placeholder="개선 사항에 대한 설명"
              />
            </div>
          </>
        );

      case 'interview':
        return (
          <>
            <div className="form-group">
              <label>질문 *</label>
              <textarea
                rows={3}
                placeholder="면접 질문을 입력하세요"
              />
            </div>
            <div className="form-group">
              <label>답변 *</label>
              <textarea
                rows={5}
                placeholder="모범 답변을 입력하세요"
              />
            </div>
            <div className="form-group">
              <label>꼬리 질문 (선택)</label>
              <textarea
                rows={3}
                placeholder="추가 꼬리 질문을 한 줄씩 입력하세요"
              />
              <span className="form-hint">각 줄마다 하나의 꼬리 질문</span>
            </div>
          </>
        );

      case 'meme':
        return (
          <>
            <div className="form-group">
              <label>이미지 URL *</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>설명 *</label>
              <textarea
                rows={3}
                placeholder="밈에 대한 설명"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>콘텐츠 관리</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <FiPlus /> 콘텐츠 추가
        </button>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>타입</th>
              <th>제목</th>
              <th>태그</th>
              <th>생성일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id}>
                <td>{content.id}</td>
                <td>
                  <span className="badge badge-type">{content.type}</span>
                </td>
                <td>{content.title}</td>
                <td>
                  <div className="tag-list">
                    {content.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>{content.createdAt}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit" onClick={() => handleEdit(content)}>
                      <FiEdit2 />
                    </button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(content.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingContent ? '콘텐츠 수정' : '콘텐츠 추가'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>타입 *</label>
                <select value={selectedType} onChange={handleTypeChange}>
                  <option value="code_tip">💡 코드 팁</option>
                  <option value="bug_challenge">🐛 버그 챌린지</option>
                  <option value="code_review">👨‍💻 코드 리뷰</option>
                  <option value="interview">🎯 면접 질문</option>
                  <option value="meme">😂 밈</option>
                </select>
              </div>

              <div className="form-group">
                <label>제목 *</label>
                <input
                  type="text"
                  placeholder="예: 💡 옵셔널 체이닝"
                  defaultValue={editingContent?.title}
                />
              </div>

              {renderTypeSpecificFields()}

              <div className="form-group">
                <label>카테고리 태그 * (복수 선택 가능)</label>
                <div className="category-selector">
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <label key={category.key} className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(category.key)}
                        onChange={() => handleTagToggle(category.key)}
                      />
                      <span>{category.label}</span>
                    </label>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    선택된 태그: {selectedTags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                {editingContent ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
