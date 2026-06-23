import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showOffersModal, setShowOffersModal] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', deadline: '' });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create request');
    }
  };

  const handleViewOffers = async (requestId) => {
    try {
      const res = await api.get(`/offers/request/${requestId}`);
      setOffers(res.data);
      const req = requests.find(r => r._id === requestId);
      setSelectedRequest(req);
      setShowOffersModal(true);
    } catch (error) {
      alert('Failed to load offers');
    }
  };

  const handleUpdateOfferStatus = async (offerId, status) => {
    try {
      await api.put(`/offers/${offerId}/status`, { status });
      if (selectedRequest) {
        const res = await api.get(`/offers/request/${selectedRequest._id}`);
        setOffers(res.data);
        fetchRequests();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update offer');
    }
  };

  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      await api.put(`/requests/${requestId}/status`, { status });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update request');
    }
  };

  // Status badge colors
  const getStatusBadge = (status) => {
    const map = {
      'open': 'bg-green-500/20 text-green-300 border-green-500/30',
      'closed': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'awarded': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
    return map[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getOfferStatusBadge = (status) => {
    const map = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'approved': 'bg-green-500/20 text-green-300 border-green-500/30',
      'rejected': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return map[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">📋 Quotation Requests</h1>
          <button
            onClick={() => setShowModal(true)}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            New Request
          </button>
        </div>

        {/* Requests Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white/50 mt-4">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">No requests yet</p>
            <p className="text-white/40 text-sm mt-2">Click "New Request" to create your first quotation request</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req, index) => (
                    <tr 
                      key={req._id} 
                      className="hover:bg-white/5 transition-all duration-200 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white/90 font-medium">{req.title}</span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm truncate max-w-xs">{req.description}</td>
                      <td className="px-6 py-4 text-white/50 text-sm">
                        {new Date(req.deadline).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(req.status)}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleViewOffers(req._id)}
                            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border border-purple-500/30 hover:border-purple-500/50"
                          >
                            📊 Offers
                          </button>
                          {req.status === 'open' && (
                            <button
                              onClick={() => handleUpdateRequestStatus(req._id, 'closed')}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                            >
                              🔒 Close
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer */}
            <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <p className="text-white/40 text-sm">
                Showing <span className="text-white/60">{requests.length}</span> requests
              </p>
              <div className="flex gap-3 text-xs">
                <span className="text-green-400">● {requests.filter(r => r.status === 'open').length} Open</span>
                <span className="text-blue-400">● {requests.filter(r => r.status === 'awarded').length} Awarded</span>
                <span className="text-gray-400">● {requests.filter(r => r.status === 'closed').length} Closed</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Request */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">📝 Create Quotation Request</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white/70 transition text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="e.g., 100 Laptops"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition resize-none"
                  placeholder="Describe what you need..."
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Offers */}
      {showOffersModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">📊 Offers</h2>
                <p className="text-white/60 text-sm mt-1">{selectedRequest.title}</p>
              </div>
              <button
                onClick={() => setShowOffersModal(false)}
                className="text-white/40 hover:text-white/70 transition text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedRequest.status)}`}>
                {selectedRequest.status.toUpperCase()}
              </span>
              <span className="text-white/40 text-sm">{offers.length} offer{offers.length !== 1 ? 's' : ''}</span>
            </div>

            {offers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-white/50">No offers submitted yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 rounded-xl">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Vendor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/60">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white/60">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {offers.map((offer) => (
                      <tr key={offer._id} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3 text-white/80 text-sm">{offer.vendorProfile?.vendorName || 'N/A'}</td>
                        <td className="px-4 py-3 text-white/50 text-sm">{offer.vendorProfile?.companyName || 'N/A'}</td>
                        <td className="px-4 py-3 text-white font-bold">${offer.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOfferStatusBadge(offer.status)}`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {offer.status === 'pending' && selectedRequest.status === 'open' && (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateOfferStatus(offer._id, 'approved')}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg text-xs font-medium transition border border-green-500/30 hover:border-green-500/50"
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() => handleUpdateOfferStatus(offer._id, 'rejected')}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg text-xs font-medium transition border border-red-500/30 hover:border-red-500/50"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          )}
                          {offer.status === 'approved' && <span className="text-green-400 text-sm">🏅 Awarded</span>}
                          {offer.status === 'rejected' && <span className="text-red-400 text-sm">Declined</span>}
                          {offer.status === 'pending' && selectedRequest.status !== 'open' && (
                            <span className="text-white/30 text-sm">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOffersModal(false)}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-white/70 hover:bg-white/20 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;