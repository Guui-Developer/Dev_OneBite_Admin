import { useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import CodeBox from '../components/CodeBox';
import MarkdownBox from '../components/MarkdownBox';
import Card from '../components/Card';

interface ContentItem {
  id: number;
  type: 'code_tip' | 'bug_challenge' | 'code_review' | 'meme' | 'interview';
  title: string;
  tags: string[];
  createdAt: string;
  // Type-specific fields
  code?: string;
  language?: string;
  description?: string;
  answer?: string;
  before?: string;
  after?: string;
  feedback?: string;
  image?: string;
  question?: string;
  tail?: string;
}

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
}

// 그룹 데이터
const GROUPS: Group[] = [
  { groupKey: 'common', groupLabel: '공통', icon: 'https://cdn.simpleicons.org/files/gray' },
  { groupKey: 'language', groupLabel: '언어', icon: 'https://cdn.simpleicons.org/files/red' },
  { groupKey: 'frontend', groupLabel: '프론트엔드', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
  { groupKey: 'backend', groupLabel: '백엔드', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { groupKey: 'database', groupLabel: '데이터베이스', icon: 'https://cdn.simpleicons.org/files/green' },
  { groupKey: 'cloud', groupLabel: '클라우드', icon: 'https://cdn.simpleicons.org/icloud/gray' },
];

// 카테고리 데이터
const AVAILABLE_CATEGORIES: Category[] = [
  { key: 'git', label: 'Git', groupKey: 'common', icon: 'https://cdn.simpleicons.org/git/F05032' },
  { key: 'docker', label: 'Docker', groupKey: 'common', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { key: 'linux', label: 'Linux', groupKey: 'common', icon: 'https://cdn.simpleicons.org/linux/FCC624' },
  { key: 'javascript', label: 'JavaScript', groupKey: 'language', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { key: 'typescript', label: 'TypeScript', groupKey: 'language', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { key: 'python', label: 'Python', groupKey: 'language', icon: 'https://cdn.simpleicons.org/python/3776AB' },
  { key: 'react', label: 'React', groupKey: 'frontend', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { key: 'vue', label: 'Vue', groupKey: 'frontend', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  { key: 'spring', label: 'Spring', groupKey: 'backend', icon: 'https://cdn.simpleicons.org/spring/6DB33F' },
  { key: 'nodejs', label: 'Node.js', groupKey: 'backend', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
];

export default function ContentSettings() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [contents] = useState<ContentItem[]>([
    {
      id: 1,
      type: 'code_tip',
      title: '💡 옵셔널 체이닝',
      tags: ['javascript', 'typescript'],
      createdAt: '2024-11-25',
      code: 'const user = { name: "John", address: { city: "Seoul" } };\n// 옵셔널 체이닝 사용\nconst city = user?.address?.city;\nconsole.log(city); // "Seoul"',
      language: 'javascript',
      description: '옵셔널 체이닝(?.)을 사용하면 중첩된 객체의 속성에 안전하게 접근할 수 있습니다.'
    },
    {
      id: 2,
      type: 'bug_challenge',
      title: '🐛 클로저 함정',
      tags: ['javascript'],
      createdAt: '2024-11-25',
      code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
      answer: 'var는 함수 스코프를 가지므로 모든 setTimeout이 같은 i를 참조합니다. let을 사용하거나 IIFE를 사용하여 해결할 수 있습니다.'
    },
    {
      id: 3,
      type: 'interview',
      title: '🎯 호이스팅이란?',
      tags: ['javascript'],
      createdAt: '2024-11-25',
      question: '자바스크립트의 호이스팅(Hoisting)에 대해 설명해주세요.',
      answer: '호이스팅은 변수와 함수 선언이 해당 스코프의 최상단으로 끌어올려지는 자바스크립트의 동작입니다. var로 선언된 변수는 undefined로 초기화되어 호이스팅되고, let과 const는 TDZ(Temporal Dead Zone)에 있어 초기화 전에는 접근할 수 없습니다.',
      tail: '호이스팅과 TDZ의 차이점은 무엇인가요?'
    },
    {
      id: 4,
      type: 'code_review',
      title: '👨‍💻 불필요한 삼항연산자',
      tags: ['javascript', 'react'],
      createdAt: '2024-11-25',
      before: 'const isActive = user.status === "active" ? true : false;',
      after: 'const isActive = user.status === "active";',
      feedback: '비교 연산자는 이미 boolean 값을 반환하므로 삼항 연산자가 불필요합니다.'
    },
    {
      id: 5,
      type: 'meme',
      title: '😂 세미콜론 논쟁',
      tags: ['javascript'],
      createdAt: '2024-11-25',
      image: 'https://via.placeholder.com/400x300',
      description: '자바스크립트 개발자들 사이의 영원한 논쟁...'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [viewingContent, setViewingContent] = useState<ContentItem | null>(null);
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

  const handleView = (content: ContentItem) => {
    setViewingContent(content);
    setShowViewModal(true);
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

  const renderViewContent = (content: ContentItem) => {
    switch (content.type) {
      case 'code_tip':
        return (
          <div className="space-y-4">
            {content.code && (
              <CodeBox code={content.code} language={content.language} title="Code" />
            )}
            {content.description && (
              <MarkdownBox content={content.description} />
            )}
          </div>
        );

      case 'bug_challenge':
        return (
          <div className="space-y-4">
            {content.code && (
              <div>
                <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">문제 코드</h3>
                <CodeBox code={content.code} />
              </div>
            )}
            {content.answer && (
              <div>
                <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">해답</h3>
                <MarkdownBox content={content.answer} />
              </div>
            )}
          </div>
        );

      case 'code_review':
        return (
          <div className="space-y-4">
            {content.before && (
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-2">❌ Before</h3>
                <CodeBox code={content.before} />
              </div>
            )}
            {content.after && (
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">✅ After</h3>
                <CodeBox code={content.after} />
              </div>
            )}
            {content.feedback && (
              <div>
                <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">피드백</h3>
                <MarkdownBox content={content.feedback} />
              </div>
            )}
          </div>
        );

      case 'interview':
        return (
          <div className="space-y-4">
            {content.question && (
              <div className="bg-[#00D9FF]/10 p-4 rounded-lg border border-[#00D9FF]/30">
                <h3 className="text-sm font-semibold text-[#00D9FF] mb-2">질문</h3>
                <p className="text-white text-sm">{content.question}</p>
              </div>
            )}
            {content.answer && (
              <div>
                <h3 className="text-sm font-semibold text-[#B0B0B0] mb-2">답변</h3>
                <MarkdownBox content={content.answer} />
              </div>
            )}
            {content.tail && (
              <div className="bg-[#2D2D2D] p-3 rounded-lg border border-[#444]">
                <p className="text-sm text-[#B0B0B0]">{content.tail}</p>
              </div>
            )}
          </div>
        );

      case 'meme':
        return (
          <div className="space-y-4">
            {content.image && (
              <div className="flex justify-center">
                <img
                  src={content.image}
                  alt={content.title}
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {content.description && (
              <MarkdownBox content={content.description} />
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">상세 내용이 없습니다.</p>
          </div>
        );
    }
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
    <div className="max-w-[1400px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="m-0 text-gray-50 text-3xl font-bold">콘텐츠 관리</h1>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus size={20} /> 콘텐츠 추가
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b-2 border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-3 border-b-2 border-transparent text-gray-400 text-base font-medium cursor-pointer transition-all -mb-0.5 ${
              activeTab === tab.key
                ? 'text-blue-400 border-blue-400'
                : 'hover:text-blue-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">ID</th>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">타입</th>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">제목</th>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">태그</th>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">생성일</th>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600">작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id} className="hover:bg-gray-700 transition-colors">
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">{content.id}</td>
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-xl text-xs font-medium">
                    {content.type}
                  </span>
                </td>
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">{content.title}</td>
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">
                  <div className="flex gap-2 flex-wrap">
                    {content.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">{content.createdAt}</td>
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">
                  <div className="flex gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all"
                      onClick={() => handleView(content)}
                      title="보기"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-all"
                      onClick={() => handleEdit(content)}
                      title="수정"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-all"
                      onClick={() => handleDelete(content.id)}
                      title="삭제"
                    >
                      <Trash2 size={16} />
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
                <div className="category-selector-grouped">
                  {GROUPS.map((group) => {
                    const groupCategories = AVAILABLE_CATEGORIES.filter(c => c.groupKey === group.groupKey);
                    if (groupCategories.length === 0) return null;

                    return (
                      <div key={group.groupKey} className="category-group">
                        <div className="category-group-header">
                          <img src={group.icon} alt={group.groupLabel} className="group-icon-small" />
                          <span className="group-label">{group.groupLabel}</span>
                        </div>
                        <div className="category-group-items">
                          {groupCategories.map((category) => (
                            <label key={category.key} className="category-checkbox">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(category.key)}
                                onChange={() => handleTagToggle(category.key)}
                              />
                              <img src={category.icon} alt={category.label} className="category-icon-small" />
                              <span>{category.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    선택된 태그: {selectedTags.map(tag => {
                      const category = AVAILABLE_CATEGORIES.find(c => c.key === tag);
                      return (
                        <span key={tag} className="tag">
                          {category && <img src={category.icon} alt={category.label} className="tag-icon" />}
                          {tag}
                        </span>
                      );
                    })}
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

      {/* 콘텐츠 보기 모달 - 실제 클라이언트 스타일 */}
      {showViewModal && viewingContent && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-[#0A0A0A] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-[#2D2D2D] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Dev OneBite" className="w-8 h-8" />
                <span className="text-lg font-bold text-white">
                  개발<span className="text-[#00D9FF]">한입</span>
                </span>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                <X size={20} className="text-[#B0B0B0]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 pt-6">
              <Card padding="lg" className="bg-[#1A1A1A] border border-[#2D2D2D]">
                {/* Type Badge and Meta Info */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      viewingContent.type === 'code_tip' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      viewingContent.type === 'bug_challenge' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      viewingContent.type === 'code_review' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      viewingContent.type === 'meme' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      viewingContent.type === 'interview' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-[#2D2D2D] text-[#B0B0B0] border border-[#444]'
                    }`}>
                      {viewingContent.type === 'code_tip' ? '💡 코드 팁' :
                       viewingContent.type === 'bug_challenge' ? '🐛 버그 챌린지' :
                       viewingContent.type === 'code_review' ? '👨‍💻 코드 리뷰' :
                       viewingContent.type === 'meme' ? '😂 밈' :
                       viewingContent.type === 'interview' ? '🎯 면접 질문' :
                       '📦 콘텐츠'}
                    </span>
                    <span className="text-xs text-[#6b7280]">ID: {viewingContent.id}</span>
                    <span className="text-xs text-[#6b7280]">{viewingContent.createdAt}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-white mb-4">
                  {viewingContent.title}
                </h1>

                {/* Content */}
                <div className="mb-4">
                  {renderViewContent(viewingContent)}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {viewingContent.tags.map((tag) => {
                    const category = AVAILABLE_CATEGORIES.find(c => c.key === tag);
                    return (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-[#2D2D2D] text-[#B0B0B0] border border-[#444] flex items-center gap-1"
                      >
                        {category && <img src={category.icon} alt={category.label} className="w-3 h-3" />}
                        {category?.label || tag}
                      </span>
                    );
                  })}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 px-4 py-2.5 bg-[#374151] text-[#e5e7eb] rounded-lg font-medium hover:bg-[#4b5563] transition-colors"
                  onClick={() => setShowViewModal(false)}
                >
                  닫기
                </button>
                <button
                  className="flex-1 px-4 py-2.5 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingContent);
                  }}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
