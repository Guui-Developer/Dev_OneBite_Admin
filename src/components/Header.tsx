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
        <div className="header-logo">
          <img src="/logo.svg" alt="Dev OneBite" className="logo-icon" />
          <h1 className="logo-text">
            <span className="logo-dev">개발</span>
            <span className="logo-onebite">한입</span>
            <span className="logo-onebite-admin">어드민[DEV]</span>
          </h1>
        </div>
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
