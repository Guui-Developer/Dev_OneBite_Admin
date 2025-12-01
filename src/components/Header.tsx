import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-content">
        <h1>Dev OneBite Admin</h1>
        <div className="header-actions">
          <span className="admin-name">관리자</span>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
