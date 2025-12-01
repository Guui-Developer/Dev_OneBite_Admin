import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: '총 사용자', value: '1,234', icon: '👥', color: '#667eea' },
    { title: '오늘 방문자', value: '567', icon: '📈', color: '#48bb78' },
    { title: '총 콘텐츠', value: '89', icon: '📝', color: '#ed8936' },
    { title: '신규 문의', value: '12', icon: '💬', color: '#f56565' },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">대시보드</h1>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2>최근 활동</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-info">
                <p className="activity-text">새로운 사용자가 가입했습니다</p>
                <span className="activity-time">5분 전</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <div className="activity-info">
                <p className="activity-text">새로운 콘텐츠가 등록되었습니다</p>
                <span className="activity-time">1시간 전</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💬</span>
              <div className="activity-info">
                <p className="activity-text">새로운 문의가 접수되었습니다</p>
                <span className="activity-time">2시간 전</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>시스템 상태</h2>
          <div className="status-list">
            <div className="status-item">
              <span>서버 상태</span>
              <span className="status-badge status-success">정상</span>
            </div>
            <div className="status-item">
              <span>데이터베이스</span>
              <span className="status-badge status-success">정상</span>
            </div>
            <div className="status-item">
              <span>API 응답시간</span>
              <span className="status-badge status-success">45ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
