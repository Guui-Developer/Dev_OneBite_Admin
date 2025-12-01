import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const menuItems = [
    { path: '/admin', label: '대시보드', icon: '📊' },
    { path: '/admin/categories', label: '카테고리 관리', icon: '🏷️' },
    { path: '/admin/contents', label: '콘텐츠 관리', icon: '📝' },
    { path: '/admin/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
