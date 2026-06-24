import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

// ✅ Cache key and duration
const CACHE_KEY = 'admin_dashboard_stats';
const CACHE_DURATION = 60000; // 1 minute

const AdminDashboard = () => {
  // ✅ Load from cache on initial render
  const [stats, setStats] = useState(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          return parsed.data;
        }
      } catch (e) {
        // Invalid cache, ignore
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!stats);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
      setError('');
      
      // ✅ Save to cache
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data: res.data,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Only fetch if no cached data
    if (!stats) {
      fetchStats(false);
    }
  }, []);

  // ✅ Show loading only on first load
  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400">
      {error}
    </div>
  );
  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      No data available
    </div>
  );

  const statCards = [
    { label: 'Total Vendors', value: stats.totalVendors, icon: '👥', bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
    { label: 'Open Requests', value: stats.openRequests, icon: '📋', bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30' },
    { label: 'Pending Offers', value: stats.pendingOffers, icon: '⏳', bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30' },
    { label: 'Approved Offers', value: stats.approvedOffers, icon: '✅', bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">📊 Admin Dashboard</h1>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              '🔄 Refresh'
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.bg} backdrop-blur-sm border ${card.border} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{card.label}</p>
                  <p className="text-4xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <span className="text-5xl opacity-80">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">🕒 Recent Activities</h2>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {stats.recentActivities.slice(0, 10).map((activity) => (
                <li key={activity.id} className="py-4 flex items-start gap-4 hover:bg-white/5 rounded-xl px-3 transition-colors">
                  <div className="flex-1">
                    <p className="text-white/90">{activity.message}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(activity.createdAt).toLocaleString()} • {activity.user}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/60 border border-white/10">
                    {activity.type.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50 text-center py-6">No recent activities</p>
          )}
        </div>

        {/* ✅ Show cache status */}
        <div className="mt-4 text-right">
          <span className="text-white/20 text-xs">
            {sessionStorage.getItem(CACHE_KEY) ? '📦 Cached' : '🔄 Live'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;