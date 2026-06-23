import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!stats) return <div className="min-h-screen flex items-center justify-center text-white">No data</div>;

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
            onClick={fetchStats}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm"
          >
            🔄 Refresh
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
              {stats.recentActivities.map((activity) => (
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
      </div>
    </div>
  );
};

export default AdminDashboard;