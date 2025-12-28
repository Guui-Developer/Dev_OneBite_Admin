import type { CategoriesData } from './model/public/response/category';
import type { GetLearningDataListData, LearningData } from './model/public/response/content_types';

// Mock Categories Data
export const mockCategoriesData: CategoriesData = {
  groups: [
    {
      groupLabel: '공통',
      groupKey: 'common',
      icon: 'https://cdn.simpleicons.org/files/gray',
      categories: [
        { key: 'git', label: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032', count: 45 },
        { key: 'docker', label: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED', count: 38 },
        { key: 'linux', label: 'Linux', icon: 'https://cdn.simpleicons.org/linux/FCC624', count: 52 },
      ]
    },
    {
      groupLabel: '언어',
      groupKey: 'language',
      icon: 'https://cdn.simpleicons.org/files/red',
      categories: [
        { key: 'javascript', label: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E', count: 67 },
        { key: 'typescript', label: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6', count: 54 },
        { key: 'python', label: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB', count: 58 },
      ]
    },
    {
      groupLabel: '프론트엔드',
      groupKey: 'frontend',
      icon: 'https://cdn.simpleicons.org/html5/E34F26',
      categories: [
        { key: 'react', label: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB', count: 89 },
        { key: 'vue', label: 'Vue', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D', count: 43 },
      ]
    },
    {
      groupLabel: '백엔드',
      groupKey: 'backend',
      icon: 'https://cdn.simpleicons.org/nodedotjs/339933',
      categories: [
        { key: 'spring', label: 'Spring', icon: 'https://cdn.simpleicons.org/spring/6DB33F', count: 72 },
        { key: 'nodejs', label: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933', count: 64 },
      ]
    },
    {
      groupLabel: '데이터베이스',
      groupKey: 'database',
      icon: 'https://cdn.simpleicons.org/files/green',
      categories: []
    },
    {
      groupLabel: '클라우드',
      groupKey: 'cloud',
      icon: 'https://cdn.simpleicons.org/icloud/gray',
      categories: []
    }
  ],
  totalCategories: 10,
  totalContent: 428
};

// Mock Content Data
export const mockContentData: LearningData[] = [
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
    answer: 'var는 함수 스코프를 가지므로 모든 setTimeout이 같은 i를 참조합니다. let을 사용하거나 IIFE를 사용하여 해결할 수 있습니다.',
    language: 'javascript'
  },
  {
    id: 3,
    type: 'interview',
    title: '🎯 호이스팅이란?',
    tags: ['javascript'],
    createdAt: '2024-11-25',
    question: '자바스크립트의 호이스팅(Hoisting)에 대해 설명해주세요.',
    answer: '호이스팅은 변수와 함수 선언이 해당 스코프의 최상단으로 끌어올려지는 자바스크립트의 동작입니다. var로 선언된 변수는 undefined로 초기화되어 호이스팅되고, let과 const는 TDZ(Temporal Dead Zone)에 있어 초기화 전에는 접근할 수 없습니다.',
    tails: ['let과 var의 호이스팅 차이는?', 'TDZ(Temporal Dead Zone)란?']
  },
  {
    id: 4,
    type: 'code_review',
    title: '👨‍💻 불필요한 삼항연산자',
    tags: ['javascript', 'react'],
    createdAt: '2024-11-25',
    before: 'const isActive = user.status === "active" ? true : false;',
    after: 'const isActive = user.status === "active";',
    feedback: '비교 연산자는 이미 boolean 값을 반환하므로 삼항 연산자가 불필요합니다.',
    language: 'javascript'
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
  {
    id: 6,
    type: 'code_tip',
    title: '💡 배열 디스트럭처링',
    tags: ['javascript', 'typescript'],
    createdAt: '2024-11-24',
    code: 'const [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first); // 1\nconsole.log(rest); // [3, 4, 5]',
    language: 'javascript',
    description: '배열 디스트럭처링을 사용하면 배열의 요소를 쉽게 변수로 추출할 수 있습니다.'
  },
  {
    id: 7,
    type: 'code_tip',
    title: '💡 React useEffect 의존성 배열',
    tags: ['react', 'typescript'],
    createdAt: '2024-11-23',
    code: 'useEffect(() => {\n  fetchData(userId);\n}, [userId]); // userId가 변경될 때만 실행',
    language: 'typescript',
    description: 'useEffect의 의존성 배열에 포함된 값이 변경될 때만 effect가 재실행됩니다.'
  }
];

export const mockContentListData: GetLearningDataListData = {
  content: mockContentData,
  pagination: {
    total: 428,
    returnedCount: 7,
    hasNext: true
  }
};
