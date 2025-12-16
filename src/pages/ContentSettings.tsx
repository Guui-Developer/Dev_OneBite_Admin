import { useState, useEffect } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import Card from '../components/Card';
import {
  CodeTipContent,
  BugChallengeContent,
  CodeReviewContent,
  MemeContent,
  InterviewContent
} from '../components/content';
import { useContentStore } from '@/store/contentStore';
import { useCategoryStore } from '@/store/categoryStore';
import type { LearningData } from '@/api/model/response/content_types';

export default function ContentSettings() {
  const { data: contentData, isLoading, fetchContents, deleteContent, addContent, updateContent } = useContentStore();
  const { data: categoryData, fetchCategories } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, [fetchContents, fetchCategories]);

  const GROUPS = categoryData?.groups || [];
  const AVAILABLE_CATEGORIES = GROUPS.flatMap(g =>
    g.categories.map(c => ({ ...c, groupKey: g.groupKey }))
  );

  const [activeTab, setActiveTab] = useState<string>('all');

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContent, setEditingContent] = useState<LearningData | null>(null);
  const [viewingContent, setViewingContent] = useState<LearningData | null>(null);
  const [formSelectedType, setFormSelectedType] = useState<string>('code_tip');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedContents, setSelectedContents] = useState<number[]>([]);

  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'code_tip', label: '코드 팁' },
    { key: 'bug_challenge', label: '버그 챌린지' },
    { key: 'code_review', label: '코드 리뷰' },
    { key: 'interview', label: '면접 질문' },
    { key: 'meme', label: '밈' },
  ];

  const contents = contentData?.content || [];
  let filteredContents = activeTab === 'all'
    ? contents
    : contents.filter(c => c.type === activeTab);

  if (filterCategory) {
    filteredContents = filteredContents.filter(c => c.tags.includes(filterCategory));
  }

  if (searchText) {
    const lowerSearch = searchText.toLowerCase();
    filteredContents = filteredContents.filter(c =>
      c.title.toLowerCase().includes(lowerSearch) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }

  const handleAdd = () => {
    setEditingContent(null);
    setFormSelectedType('code_tip');
    setSelectedTags([]);
    setShowModal(true);
  };

  const handleView = (content: LearningData) => {
    setViewingContent(content);
    setShowViewModal(true);
  };

  const handleEdit = (content: LearningData) => {
    setEditingContent(content);
    setFormSelectedType(content.type);
    setSelectedTags(content.tags);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(`ID ${id} 콘텐츠를 삭제하시겠습니까?`)) {
      try {
        await deleteContent(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = (e.target as HTMLButtonElement).closest('form') || (e.target as HTMLButtonElement).parentElement?.parentElement;
      if (!form) return;

      const titleInput = form.querySelector<HTMLInputElement>('input[placeholder*="옵셔널 체이닝"]');
      if (!titleInput) return;

      const title = titleInput.value.trim();
      if (!title) {
        alert('제목을 입력해주세요.');
        return;
      }

      if (selectedTags.length === 0) {
        alert('최소 1개의 카테고리 태그를 선택해주세요.');
        return;
      }

      const contentData: any = {
        type: formSelectedType,
        title,
        tags: selectedTags,
        createdAt: new Date().toISOString(),
      };

      const textareas = form.querySelectorAll<HTMLTextAreaElement>('textarea');
      const inputs = form.querySelectorAll<HTMLInputElement>('input[type="text"]');

      switch (formSelectedType) {
        case 'code_tip':
          contentData.code = textareas[0]?.value || '';
          contentData.language = inputs[1]?.value || 'javascript';
          contentData.description = textareas[1]?.value || '';
          break;
        case 'bug_challenge':
          contentData.code = textareas[0]?.value || '';
          contentData.answer = textareas[1]?.value || '';
          break;
        case 'code_review':
          contentData.before = textareas[0]?.value || '';
          contentData.after = textareas[1]?.value || '';
          contentData.feedback = textareas[2]?.value || '';
          break;
        case 'interview':
          contentData.question = textareas[0]?.value || '';
          contentData.answer = textareas[1]?.value || '';
          contentData.tails = textareas[2]?.value.split('\n').filter(t => t.trim()) || [];
          break;
        case 'meme':
          contentData.image = inputs[1]?.value || '';
          contentData.description = textareas[0]?.value || '';
          break;
      }

      if (editingContent) {
        await updateContent(editingContent.id, contentData);
      } else {
        contentData.id = Date.now();
        await addContent(contentData);
      }

      setShowModal(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (categoryKey: string) => {
    setSelectedTags(prev =>
      prev.includes(categoryKey)
        ? prev.filter(t => t !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormSelectedType(e.target.value);
  };

  const handleContentCheck = (id: number) => {
    setSelectedContents(prev =>
      prev.includes(id)
        ? prev.filter(contentId => contentId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContents.length === filteredContents.length) {
      setSelectedContents([]);
    } else {
      setSelectedContents(filteredContents.map(c => c.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedContents.length === 0) return;
    if (confirm(`선택한 ${selectedContents.length}개의 콘텐츠를 삭제하시겠습니까?`)) {
      try {
        for (const id of selectedContents) {
          await deleteContent(id);
        }
        setSelectedContents([]);
      } catch (error) {
        alert(error instanceof Error ? error.message : '삭제 실패');
      }
    }
  };

  const renderViewContent = (content: LearningData) => {
    switch (content.type) {
      case 'code_tip':
        if (!content.code || !content.description) {
          return <div className="text-center py-8"><p className="text-gray-500 italic">상세 내용이 없습니다.</p></div>;
        }
        return (
          <CodeTipContent
            content={{
              type: 'code_tip',
              id: content.id,
              code: content.code,
              language: content.language || 'javascript',
              description: content.description,
              title: content.title,
              tags: content.tags,
              createdAt: content.createdAt
            }}
          />
        );

      case 'bug_challenge':
        if (!content.code || !content.answer) {
          return <div className="text-center py-8"><p className="text-gray-500 italic">상세 내용이 없습니다.</p></div>;
        }
        return (
          <BugChallengeContent
            content={{
              type: 'bug_challenge',
              id: content.id,
              code: content.code,
              answer: content.answer,
              title: content.title,
              tags: content.tags,
              createdAt: content.createdAt
            }}
          />
        );

      case 'code_review':
        if (!content.before || !content.after || !content.feedback) {
          return <div className="text-center py-8"><p className="text-gray-500 italic">상세 내용이 없습니다.</p></div>;
        }
        return (
          <CodeReviewContent
            content={{
              type: 'code_review',
              id: content.id,
              before: content.before,
              after: content.after,
              feedback: content.feedback,
              title: content.title,
              tags: content.tags,
              createdAt: content.createdAt
            }}
          />
        );

      case 'interview':
        if (!content.question || !content.answer) {
          return <div className="text-center py-8"><p className="text-gray-500 italic">상세 내용이 없습니다.</p></div>;
        }
        return (
          <InterviewContent
            content={{
              type: 'interview',
              id: content.id,
              question: content.question,
              answer: content.answer,
              tails: content.tails || [],
              title: content.title,
              tags: content.tags,
              createdAt: content.createdAt
            }}
          />
        );

      case 'meme':
        if (!content.image || !content.description) {
          return <div className="text-center py-8"><p className="text-gray-500 italic">상세 내용이 없습니다.</p></div>;
        }
        return (
          <MemeContent
            content={{
              type: 'meme',
              id: content.id,
              image: content.image,
              description: content.description,
              title: content.title,
              tags: content.tags,
              createdAt: content.createdAt
            }}
          />
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
    const inputClass = "w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600";
    const textareaClass = "w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600 font-mono";
    const labelClass = "block mb-2 text-gray-300 text-sm font-semibold";

    switch (formSelectedType) {
      case 'code_tip':
        return (
          <>
            <div>
              <label className={labelClass}>코드 *</label>
              <textarea
                rows={6}
                placeholder="const example = () => {...}"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>언어 *</label>
              <input
                type="text"
                placeholder="예: JavaScript"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>설명 *</label>
              <textarea
                rows={3}
                placeholder="코드에 대한 설명을 입력하세요"
                className={textareaClass}
              />
            </div>
          </>
        );

      case 'bug_challenge':
        return (
          <>
            <div>
              <label className={labelClass}>문제 코드 *</label>
              <textarea
                rows={6}
                placeholder="버그가 있는 코드를 입력하세요"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>정답/해설 *</label>
              <textarea
                rows={4}
                placeholder="버그의 원인과 해결 방법을 설명하세요"
                className={textareaClass}
              />
            </div>
          </>
        );

      case 'code_review':
        return (
          <>
            <div>
              <label className={labelClass}>개선 전 코드 *</label>
              <textarea
                rows={5}
                placeholder="개선 전 코드"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>개선 후 코드 *</label>
              <textarea
                rows={5}
                placeholder="개선 후 코드"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>피드백 *</label>
              <textarea
                rows={3}
                placeholder="개선 사항에 대한 설명"
                className={textareaClass}
              />
            </div>
          </>
        );

      case 'interview':
        return (
          <>
            <div>
              <label className={labelClass}>질문 *</label>
              <textarea
                rows={3}
                placeholder="면접 질문을 입력하세요"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>답변 *</label>
              <textarea
                rows={5}
                placeholder="모범 답변을 입력하세요"
                className={textareaClass}
              />
            </div>
            <div>
              <label className={labelClass}>꼬리 질문 (선택)</label>
              <textarea
                rows={3}
                placeholder="추가 꼬리 질문을 한 줄씩 입력하세요"
                className={textareaClass}
              />
              <span className="text-gray-500 text-xs mt-1 block">각 줄마다 하나의 꼬리 질문</span>
            </div>
          </>
        );

      case 'meme':
        return (
          <>
            <div>
              <label className={labelClass}>이미지 URL *</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>설명 *</label>
              <textarea
                rows={3}
                placeholder="밈에 대한 설명"
                className={textareaClass}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] flex items-center justify-center py-20">
        <div className="text-gray-400 text-lg">로딩 중...</div>
      </div>
    );
  }

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
            className={`px-6 py-3 border-b-2 text-base font-medium cursor-pointer transition-all -mb-0.5 ${
              activeTab === tab.key
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-blue-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="제목 또는 태그로 검색..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
          />
        </div>
        <div className="w-64">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
          >
            <option value="">모든 카테고리</option>
            {AVAILABLE_CATEGORIES.map((category) => (
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        {(searchText || filterCategory) && (
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg transition-colors"
            onClick={() => {
              setSearchText('');
              setFilterCategory('');
            }}
          >
            필터 초기화
          </button>
        )}
      </div>

      {selectedContents.length > 0 && (
        <div className="mb-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
          <span className="text-blue-400 font-medium">
            {selectedContents.length}개 항목 선택됨
          </span>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            onClick={handleDeleteSelected}
          >
            <Trash2 size={16} />
            선택 삭제
          </button>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left text-gray-300 text-sm font-semibold border-b border-gray-600 w-12">
                <input
                  type="checkbox"
                  checked={selectedContents.length === filteredContents.length && filteredContents.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                />
              </th>
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
                <td className="p-4 text-gray-200 text-sm border-b border-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedContents.includes(content.id)}
                    onChange={() => handleContentCheck(content.id)}
                    className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
                  />
                </td>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-800 flex justify-between items-center p-6 border-b border-gray-700 z-10">
              <h2 className="text-xl font-semibold text-gray-50 m-0">{editingContent ? '콘텐츠 수정' : '콘텐츠 추가'}</h2>
              <button
                className="text-gray-400 hover:text-gray-200 text-3xl leading-none transition-colors"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">타입 *</label>
                <select
                  value={formSelectedType}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                >
                  <option value="code_tip">💡 코드 팁</option>
                  <option value="bug_challenge">🐛 버그 챌린지</option>
                  <option value="code_review">👨‍💻 코드 리뷰</option>
                  <option value="interview">🎯 면접 질문</option>
                  <option value="meme">😂 밈</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">제목 *</label>
                <input
                  type="text"
                  placeholder="예: 💡 옵셔널 체이닝"
                  defaultValue={editingContent?.title}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
                />
              </div>

              {renderTypeSpecificFields()}

              <div>
                <label className="block mb-2 text-gray-300 text-sm font-semibold">카테고리 태그 * (복수 선택 가능)</label>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 space-y-4">
                  {GROUPS.map((group) => {
                    const groupCategories = AVAILABLE_CATEGORIES.filter(c => c.groupKey === group.groupKey);
                    if (groupCategories.length === 0) return null;

                    return (
                      <div key={group.groupKey} className="space-y-2">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-600">
                          <img src={group.icon} alt={group.groupLabel} className="w-5 h-5" />
                          <span className="text-gray-300 font-semibold text-sm">{group.groupLabel}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {groupCategories.map((category) => (
                            <label
                              key={category.key}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(category.key)}
                                onChange={() => handleTagToggle(category.key)}
                                className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                              />
                              <img src={category.icon} alt={category.label} className="w-4 h-4" />
                              <span className="text-gray-200 text-sm">{category.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-600/10 rounded-lg border border-blue-500/30">
                    <span className="text-gray-300 text-sm font-semibold mr-2">선택된 태그:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map(tag => {
                        const category = AVAILABLE_CATEGORIES.find(c => c.key === tag);
                        return (
                          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                            {category && <img src={category.icon} alt={category.label} className="w-3 h-3" />}
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-700">
              <button
                className="flex-1 py-3 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : (editingContent ? '수정' : '추가')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewingContent && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-[#0A0A0A] w-[500px] max-h-[90vh] overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="p-4 pt-6">
              <Card padding="lg" className="bg-[#1A1A1A] border border-[#2D2D2D]">
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

                <h1 className="text-xl font-bold text-white mb-4">
                  {viewingContent.title}
                </h1>

                <div className="mb-4">
                  {renderViewContent(viewingContent)}
                </div>

                <div className="flex flex-wrap gap-2">
                  {viewingContent.tags.map((tag: string) => {
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
