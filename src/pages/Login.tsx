import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '@/api/modules/AdminApi';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const adminApi = new AdminApi();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await adminApi.login({
        id: id,
        password: password,
      });

      console.log('[Login] Response:', response);

      // 직접 토큰 저장
      if (response.accessToken && response.accessExpiresAt) {
        setAuth(response.accessToken, response.accessExpiresAt);
        console.log('[Login] Token saved, navigating to /admin');
        navigate('/admin');
      } else {
        console.error('[Login] Missing token in response:', response);
        setError('로그인 응답에 토큰이 없습니다.');
      }
    } catch (err) {
      console.error('[Login] Login failed:', err);
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
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

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}