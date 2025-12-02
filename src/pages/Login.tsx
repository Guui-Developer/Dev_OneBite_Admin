import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (id && password) {
      // 임시로 로컬스토리지에 토큰 저장
      sessionStorage.setItem('adminToken', 'temp-token');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo.svg" alt="Dev OneBite" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-50 flex items-center gap-1">
            <span>개발</span>
            <span className="text-[#00D9FF]">한입</span>
          </h1>
        </div>
        <p className="text-center text-gray-400 mb-8 text-sm">관리자 페이지</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id" className="block mb-2 text-gray-300 text-sm font-semibold">
              아이디
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-gray-300 text-sm font-semibold">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-4 py-3 border border-gray-600 rounded-lg text-base text-gray-200 bg-gray-700 transition-colors focus:outline-none focus:border-blue-400 focus:bg-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}