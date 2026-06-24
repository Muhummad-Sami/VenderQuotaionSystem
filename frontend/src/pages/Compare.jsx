// frontend/src/pages/Compare.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Compare = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const { user, isAdmin } = useAuth();

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const res = await api.get('/offers/comparison');
      setComparisonData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const handleUpdateOfferStatus = async (offerId, requestId, newStatus) => {
    try {
      await api.put(`/offers/${offerId}/status`, { status: newStatus });
      fetchComparison();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update offer');
    }
  };

  const exportPDF = async () => {
    if (comparisonData.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      setExporting(true);
      const response = await api.post(
        '/pdf/comparison',
        { comparisonData },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quotation-comparison-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // ✅ Show loading spinner
  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">📊 Quotation Comparison</h1>
          <div className="flex gap-3">
            <button
              onClick={exportPDF}
              disabled={exporting || comparisonData.length === 0}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-5 py-2 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-500/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? '⏳ Generating...' : '📄 Export PDF'}
            </button>
            <button
              onClick={fetchComparison}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {comparisonData.length === 0 ? (
          <div className="text-center text-white/50 py-20">No quotations available for comparison.</div>
        ) : (
          <div className="space-y-8">
            {comparisonData.map((group) => (
              <div key={group.request._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300">
                {/* Request Header */}
                <div className="bg-white/10 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{group.request.title}</h2>
                    <p className="text-white/60 text-sm mt-1">{group.request.description}</p>
                    <div className="flex gap-4 mt-1 text-xs text-white/40">
                      <span>📅 Deadline: {new Date(group.request.deadline).toLocaleDateString()}</span>
                      <span>👤 {group.request.createdBy?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
                      group.request.status === 'open' ? 'bg-green-500/30 text-green-300 border border-green-500/30' :
                      group.request.status === 'awarded' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30' :
                      'bg-gray-500/30 text-gray-300 border border-gray-500/30'
                    }`}>
                      {group.request.status.toUpperCase()}
                    </span>
                    <span className="text-white/40 text-sm">{group.offers.length} offers</span>
                  </div>
                </div>

                {/* Offers Table */}
                {group.offers.length === 0 ? (
                  <div className="p-6 text-white/40 text-center">No offers yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Vendor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Amount ($)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Reference</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Status</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-white/60">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {group.offers.map((offer) => (
                          <tr
                            key={offer._id}
                            className={`transition-colors ${
                              offer.isCheapest && offer.status === 'pending'
                                ? 'bg-green-500/10 border-l-4 border-green-500'
                                : offer.status === 'approved'
                                ? 'bg-blue-500/10'
                                : offer.status === 'rejected'
                                ? 'bg-red-500/10'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <td className="px-6 py-4 text-sm text-white/90">
                              {offer.vendorProfile?.vendorName || 'N/A'}
                              {offer.isCheapest && offer.status === 'pending' && (
                                <span className="ml-2 bg-green-500/30 text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-500/30 animate-pulse">🏆 CHEAPEST</span>
                              )}
                              {offer.isCheapest && offer.status === 'approved' && (
                                <span className="ml-2 bg-blue-500/30 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">✅ AWARDED</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-white/60">{offer.vendorProfile?.companyName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm font-bold text-white">${offer.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-white/40">{offer.reference || '-'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                offer.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                offer.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              }`}>
                                {offer.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {isAdmin && offer.status === 'pending' && group.request.status === 'open' && (
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleUpdateOfferStatus(offer._id, group.request._id, 'approved')}
                                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-sm transition border border-green-500/30 hover:border-green-500/50"
                                  >
                                    ✅ Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOfferStatus(offer._id, group.request._id, 'rejected')}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm transition border border-red-500/30 hover:border-red-500/50"
                                  >
                                    ❌ Reject
                                  </button>
                                </div>
                              )}
                              {offer.status === 'approved' && <span className="text-green-400 text-sm font-medium">🏅 Winner</span>}
                              {offer.status === 'rejected' && <span className="text-red-400 text-sm">Declined</span>}
                              {offer.status === 'pending' && !isAdmin && <span className="text-yellow-400 text-sm">Awaiting review</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;