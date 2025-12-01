import { useState } from 'react';
import type { MouseEvent } from 'react';
import './Settings.css';

interface ContentItem {
  id: number;
  type: string;
  title: string;
  tags: string[];
  createdAt: string;
}

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
    setShowModal(true);
  };

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(`ID ${id} 콘텐츠를 삭제하시겠습니까?`)) {
      // API 호출 예정
      console.log('Delete content:', id);
    }
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // API 호출 예정
    console.log('Submit:', editingContent);
    setShowModal(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>콘텐츠 관리</h1>
        <button className="btn-primary" onClick={handleAdd}>
          + 콘텐츠 추가
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
                    <button className="btn-edit" onClick={() => handleEdit(content)}>
                      수정
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(content.id)}>
                      삭제
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
                <label>타입</label>
                <select defaultValue={editingContent?.type}>
                  <option value="code_tip">코드 팁</option>
                  <option value="bug_challenge">버그 챌린지</option>
                  <option value="code_review">코드 리뷰</option>
                  <option value="interview">면접 질문</option>
                  <option value="meme">밈</option>
                </select>
              </div>
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  placeholder="예: 💡 옵셔널 체이닝"
                  defaultValue={editingContent?.title}
                />
              </div>
              <div className="form-group">
                <label>태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: javascript, typescript"
                  defaultValue={editingContent?.tags.join(', ')}
                />
              </div>
              <div className="form-group">
                <label>코드/내용</label>
                <textarea
                  rows={6}
                  placeholder="코드나 내용을 입력하세요"
                />
              </div>
              <div className="form-group">
                <label>설명</label>
                <textarea
                  rows={3}
                  placeholder="설명을 입력하세요"
                />
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
