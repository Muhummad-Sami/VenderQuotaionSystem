import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'vendor',
    vendorProfile: {
      vendorName: '',
      companyName: '',
      contactNumber: '',
      businessAddress: '',
    },
  });
  const [localError, setLocalError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vendorProfile.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        vendorProfile: { ...prev.vendorProfile, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Vendor Registration</h2>
            <p className="text-blue-200/70 mt-2">Join our platform</p>
          </div>

          {localError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl mb-4 text-sm">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
            <div className="mb-3">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Vendor Name</label>
              <input
                type="text"
                name="vendorProfile.vendorName"
                value={formData.vendorProfile.vendorName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="John's Supplies"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="vendorProfile.companyName"
                value={formData.vendorProfile.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="John Supplies Inc."
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Contact Number</label>
              <input
                type="text"
                name="vendorProfile.contactNumber"
                value={formData.vendorProfile.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-blue-200/80 text-sm font-medium mb-1">Business Address</label>
              <textarea
                name="vendorProfile.businessAddress"
                value={formData.vendorProfile.businessAddress}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                placeholder="123 Main Street, City"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-0.5"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-blue-200/70">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;