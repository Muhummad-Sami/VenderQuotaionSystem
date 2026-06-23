import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/activities?page=${pageNum}&limit=20${filter ? `&action=${filter}` : ''}`);
      setActivities(res.data.activities);
      setTotalPages(res.data.pagination.pages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/activities/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchActivities(1);
  }, [filter]);

  const actionColors = {
    login: 'bg-green-500/20 text-green-300 border-green-500/30',
    logout: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    create_request: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    update_request: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    close_request: 'bg-red-500/20 text-red-300 border-red-500/30',
    submit_offer: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    approve_offer: 'bg-green-500/20 text-green-300 border-green-500/30',
    reject_offer: 'bg-red-500/20 text-red-300 border-red-500/30',
    create_vendor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    update_vendor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    delete_vendor: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  const getActionLabel = (action) => {
    return action.replace(/_/g, ' ').toUpperCase();
  };

  if (loading && activities.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">📊 Activity Logs</h1>
          <div className="flex gap-3">
            {/* ✅ FIXED: Dropdown with visible text */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-800 text-white">All Actions</option>
              <option value="login" className="bg-slate-800 text-white">Login</option>
              <option value="logout" className="bg-slate-800 text-white">Logout</option>
              <option value="create_request" className="bg-slate-800 text-white">Create Request</option>
              <option value="update_request" className="bg-slate-800 text-white">Update Request</option>
              <option value="close_request" className="bg-slate-800 text-white">Close Request</option>
              <option value="submit_offer" className="bg-slate-800 text-white">Submit Offer</option>
              <option value="approve_offer" className="bg-slate-800 text-white">Approve Offer</option>
              <option value="reject_offer" className="bg-slate-800 text-white">Reject Offer</option>
              <option value="create_vendor" className="bg-slate-800 text-white">Create Vendor</option>
              <option value="update_vendor" className="bg-slate-800 text-white">Update Vendor</option>
              <option value="delete_vendor" className="bg-slate-800 text-white">Delete Vendor</option>
            </select>
            <button
              onClick={() => { fetchActivities(1); fetchStats(); }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <p className="text-white/50 text-sm">Total Activities</p>
              <p className="text-2xl font-bold text-white">{stats.totalLogs}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <p className="text-white/50 text-sm">Most Common Action</p>
              <p className="text-xl font-bold text-white">
                {stats.actionCounts[0]?._id?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 col-span-2">
              <p className="text-white/50 text-sm">Actions Breakdown</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {stats.actionCounts.slice(0, 5).map((item) => (
                  <span key={item._id} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                    {item._id.replace(/_/g, ' ')}: {item.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activities Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-white/40">No activities found</td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity._id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white/90 text-sm">{activity.userEmail}</p>
                          <span className="text-xs text-white/30">{activity.userRole}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${actionColors[activity.action] || 'bg-white/10 text-white/60 border-white/10'}`}>
                          {getActionLabel(activity.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {activity.details?.requestTitle || activity.details?.vendorName || activity.details?.amount ? (
                          <span className="text-xs">
                            {activity.details.requestTitle && `📌 ${activity.details.requestTitle}`}
                            {activity.details.vendorName && `👤 ${activity.details.vendorName}`}
                            {activity.details.amount && ` 💰 $${activity.details.amount}`}
                          </span>
                        ) : (
                          <span className="text-white/30 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/40 text-xs">
                        {new Date(activity.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => fetchActivities(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 bg-white/10 rounded-xl text-white/70 disabled:opacity-30 hover:bg-white/20 transition text-sm"
              >
                Previous
              </button>
              <span className="text-white/40 text-sm">Page {page} of {totalPages}</span>
              <button
                onClick={() => fetchActivities(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-white/10 rounded-xl text-white/70 disabled:opacity-30 hover:bg-white/20 transition text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;