import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/categories', label: '카테고리 관리', icon: '🏷️' },
    { path: '/admin/contents', label: '콘텐츠 관리', icon: '📝' },
    { path: '/admin/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-700">
        <div className="text-xl font-bold font-sans flex items-center gap-1">
          <span className="text-gray-50">Menu</span>
        </div>
      </div>
      <nav className="py-4 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3.5 text-gray-400 no-underline transition-all border-l-3 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border-l-blue-400 font-semibold'
                  : 'border-l-transparent hover:bg-gray-700 hover:text-blue-400'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
