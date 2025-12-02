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
    <div className="max-w-[1400px]">
      <h1 className="mb-8 text-gray-50 text-3xl font-bold">대시보드</h1>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {mainStats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 shadow-lg border border-gray-700 transition-all hover:-translate-y-1 hover:shadow-2xl min-h-[100px]"
            style={{ borderLeftWidth: '4px', borderLeftColor: stat.color }}
          >
            <div className="text-3xl shrink-0" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <h3 className="m-0 mb-2 text-gray-400 text-sm font-medium">{stat.title}</h3>
              <div className="flex items-center gap-3">
                <p className="m-0 text-2xl font-bold text-gray-50">{stat.value}</p>
                {stat.trend && (
                  <span className="text-sm font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 콘텐츠 타입별 통계 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="m-0 mb-6 text-gray-50 text-xl font-semibold">콘텐츠 타입별 통계</h2>
          <div className="flex flex-col gap-3">
            {contentStats.map((content, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" style={{ color: content.color }}>
                    {content.icon}
                  </span>
                  <span className="text-gray-200 text-base font-medium">{content.type}</span>
                </div>
                <span className="text-gray-50 text-lg font-bold">{content.count}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-4 py-3 mt-2 bg-gray-600 rounded-md border-t-2 border-blue-500 font-semibold text-gray-50">
              <span>전체</span>
              <span className="text-2xl text-blue-400">
                {contentStats.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="m-0 mb-6 text-gray-50 text-xl font-semibold">시스템 상태</h2>
          <div className="flex flex-col gap-4">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center px-4 py-4 bg-gray-700 rounded-md">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-200 text-base font-medium">{item.name}</span>
                  <span className="text-gray-400 text-sm">{item.value}</span>
                </div>
                <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                  item.statusType === 'success' ? 'bg-green-500/20 text-green-400' :
                  item.statusType === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
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
