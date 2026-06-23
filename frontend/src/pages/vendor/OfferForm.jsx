import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const OfferForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [formData, setFormData] = useState({ amount: '', reference: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/${requestId}`);
        setRequest(res.data);
      } catch (err) {
        setError('Request not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/offers', {
        requestId,
        amount: parseFloat(formData.amount),
        reference: formData.reference,
      });
      navigate('/vendor/requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!request) return <div className="min-h-screen flex items-center justify-center text-white">Request not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Quotation Offer</h1>
          <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
            <h3 className="text-white font-semibold">{request.title}</h3>
            <p className="text-white/60 text-sm mt-1">{request.description}</p>
            <p className="text-white/40 text-xs mt-1">Deadline: {new Date(request.deadline).toLocaleDateString()}</p>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white/80 text-sm font-medium mb-1">Amount ($) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="0.00"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-1">Reference (Optional)</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="QUOTE-12345"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/vendor/requests')}
                className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;