import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    vendorName: '',
    companyName: '',
    contactNumber: '',
    businessAddress: ''
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vendors?search=${search}`);
      setVendors(res.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      vendorName: '',
      companyName: '',
      contactNumber: '',
      businessAddress: ''
    });
    setEditingVendor(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      email: vendor.user?.email || '',
      password: '',
      vendorName: vendor.vendorName || '',
      companyName: vendor.companyName || '',
      contactNumber: vendor.contactNumber || '',
      businessAddress: vendor.businessAddress || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await api.put(`/vendors/${editingVendor._id}`, formData);
      } else {
        await api.post('/vendors', formData);
      }
      setShowModal(false);
      resetForm();
      fetchVendors();
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete vendor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">👥 Vendor Management</h1>
          <button
            onClick={handleAdd}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            Add Vendor
          </button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search vendors by name, company, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white/50 mt-4">Loading vendors...</p>
            </div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-white/60 text-lg">No vendors found</p>
            <p className="text-white/40 text-sm mt-2">Click "Add Vendor" to get started</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vendors.map((vendor, index) => (
                    <tr 
                      key={vendor._id} 
                      className="hover:bg-white/5 transition-all duration-200 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {vendor.vendorName?.charAt(0) || 'V'}
                          </div>
                          <span className="text-white/90 font-medium">{vendor.vendorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{vendor.companyName}</td>
                      <td className="px-6 py-4 text-white/60">{vendor.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-white/60">{vendor.contactNumber}</td>
                      <td className="px-6 py-4 text-white/40 text-sm truncate max-w-xs">{vendor.businessAddress}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(vendor)}
                            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500/50"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vendor._id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 px-6 py-4 border-t border-white/10">
              <p className="text-white/40 text-sm">
                Showing <span className="text-white/60">{vendors.length}</span> vendors
              </p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingVendor ? '✏️ Edit Vendor' : '➕ Add New Vendor'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-white/40 hover:text-white/70 transition text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="vendor@example.com"
                  required
                />
              </div>

              {!editingVendor && (
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                    placeholder="••••••••"
                    required={!editingVendor}
                    minLength="6"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Vendor Name *</label>
                <input
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="John's Supplies"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="John Supplies Inc."
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Contact Number *</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Business Address *</label>
                <textarea
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition resize-none"
                  placeholder="123 Main Street, City, Country"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                >
                  {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;