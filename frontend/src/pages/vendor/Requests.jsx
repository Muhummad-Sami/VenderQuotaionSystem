import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const VendorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, offersRes] = await Promise.all([
        api.get('/requests?status=open'),
        api.get('/offers/my-offers')
      ]);
      setRequests(requestsRes.data);
      setMyOffers(offersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasSubmittedOffer = (requestId) => {
    return myOffers.some(offer => offer.request?._id === requestId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">📋 Open Quotation Requests</h1>
          <button
            onClick={fetchData}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white/50 mt-4">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-white/60 text-lg">No open requests available</p>
            <p className="text-white/40 text-sm mt-2">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req, index) => (
              <div
                key={req._id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
                    {req.title}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    OPEN
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{req.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                  <span>📅 {new Date(req.deadline).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  {hasSubmittedOffer(req._id) ? (
                    <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      ✓ Offer Submitted
                    </span>
                  ) : (
                    <Link
                      to={`/vendor/offer/${req._id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                    >
                      Submit Offer →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRequests;