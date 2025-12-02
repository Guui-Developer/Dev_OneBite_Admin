import './Dashboard.css';

export default function Dashboard() {
  // 주요 통계
  const mainStats = [
    { title: 'Google Play 다운로드', value: '12,345', icon: '🤖', color: '#48bb78', trend: '+12%' },
    { title: 'App Store 다운로드', value: '8,901', icon: '🍎', color: '#667eea', trend: '+8%' },
    { title: '오늘 방문자', value: '567', icon: '📈', color: '#f59e0b', trend: '+24%' },
    { title: '총 방문자', value: '45,234', icon: '👥', color: '#8b5cf6', trend: '' },
    { title: '총 콘텐츠', value: '289', icon: '📝', color: '#ec4899', trend: '' },
    { title: '오늘 신규 콘텐츠', value: '8', icon: '✨', color: '#10b981', trend: '' },
  ];

  // 콘텐츠 타입별 통계
  const contentStats = [
    { type: '코드 팁', count: 89, icon: '💡', color: '#3b82f6' },
    { type: '버그 챌린지', count: 45, icon: '🐛', color: '#ef4444' },
    { type: '코드 리뷰', count: 67, icon: '🔍', color: '#8b5cf6' },
    { type: '면접 질문', count: 52, icon: '💬', color: '#f59e0b' },
    { type: '밈', count: 36, icon: '😄', color: '#ec4899' },
  ];

  // 시스템 상태
  const systemStatus = [
    { name: '서버 상태', status: '정상', value: 'Running', statusType: 'success' },
    { name: 'API 응답시간', status: '양호', value: '45ms', statusType: 'success' },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">대시보드</h1>

      {/* 주요 통계 카드 */}
      <div className="stats-grid">
        {mainStats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-value-container">
                <p className="stat-value">{stat.value}</p>
                {stat.trend && (
                  <span className="stat-trend positive">{stat.trend}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* 콘텐츠 타입별 통계 */}
        <div className="content-card content-types-card">
          <h2>콘텐츠 타입별 통계</h2>
          <div className="content-types-list">
            {contentStats.map((content, index) => (
              <div key={index} className="content-type-item">
                <div className="content-type-header">
                  <span className="content-type-icon" style={{ color: content.color }}>
                    {content.icon}
                  </span>
                  <span className="content-type-name">{content.type}</span>
                </div>
                <span className="content-type-count">{content.count}</span>
              </div>
            ))}
            <div className="content-type-total">
              <span>전체</span>
              <span className="total-count">
                {contentStats.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="content-card">
          <h2>시스템 상태</h2>
          <div className="status-list">
            {systemStatus.map((item, index) => (
              <div key={index} className="status-item">
                <div className="status-info">
                  <span className="status-name">{item.name}</span>
                  <span className="status-detail">{item.value}</span>
                </div>
                <span className={`status-badge status-${item.statusType}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
