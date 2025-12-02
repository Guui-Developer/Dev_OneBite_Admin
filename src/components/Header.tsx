import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-8 h-16 flex items-center sticky top-0 z-10 shadow-lg">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Dev OneBite" className="w-10 h-10 object-contain" />
          <h1 className="m-0 text-2xl font-bold font-sans flex items-center gap-1">
            <span className="text-gray-50">개발</span>
            <span className="text-[#00D9FF]">한입</span>
            <span className="text-[#df5d5d] text-[2rem]">어드민[DEV]</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-200 font-medium">관리자</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
