// frontend/src/pages/vendor/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const CACHE_KEY = 'vendor_dashboard_stats';
const CACHE_DURATION = 60000;

const VendorDashboard = () => {
  const [stats, setStats] = useState(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          return parsed.data;
        }
      } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(!stats);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
      setError('');
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
    if (!stats) fetchStats(false);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!stats) return <div className="min-h-screen flex items-center justify-center text-white">No data</div>;

  const statCards = [
    { label: 'Total Offers', value: stats.totalOffers, icon: '📤', bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
    { label: 'Pending', value: stats.pendingOffers, icon: '⏳', bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30' },
    { label: 'Approved', value: stats.approvedOffers, icon: '✅', bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30' },
    { label: 'Rejected', value: stats.rejectedOffers, icon: '❌', bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30' },
    { label: 'Open Requests', value: stats.openRequests, icon: '📋', bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">🧑‍💼 Vendor Dashboard</h1>
          <div className="flex gap-3">
            <Link
              to="/vendor/requests"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
            >
              View Open Requests
            </Link>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {refreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
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

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">🕒 Your Recent Activity</h2>
          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {stats.recentActivities.slice(0, 10).map((activity) => (
                <li key={activity.id} className="py-4 flex items-start gap-4 hover:bg-white/5 rounded-xl px-3 transition-colors">
                  <div className="flex-1">
                    <p className="text-white/90">{activity.message}</p>
                    <p className="text-white/40 text-xs mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/60 border border-white/10">Offer</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50 text-center py-6">
              You haven't submitted any offers yet.
              <Link to="/vendor/requests" className="ml-2 text-blue-400 hover:text-blue-300 transition">
                Browse open requests →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;