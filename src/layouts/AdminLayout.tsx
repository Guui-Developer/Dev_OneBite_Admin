import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout() {
  // 로그인 체크
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
