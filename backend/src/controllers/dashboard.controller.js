const VendorProfile = require('../models/VendorProfile');
const QuotationRequest = require('../models/QuotationRequest');
const QuotationOffer = require('../models/QuotationOffer');

// @desc    Get dashboard statistics and recent activities
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'admin') {
      const [totalVendors, openRequests, pendingOffers, approvedOffers] = await Promise.all([
        VendorProfile.countDocuments(),
        QuotationRequest.countDocuments({ status: 'open' }),
        QuotationOffer.countDocuments({ status: 'pending' }),
        QuotationOffer.countDocuments({ status: 'approved' }),
      ]);

      stats = {
        totalVendors,
        openRequests,
        pendingOffers,
        approvedOffers,
        totalOffers: pendingOffers + approvedOffers,
      };

      const [recentVendors, recentRequests, recentOffers] = await Promise.all([
        VendorProfile.find().sort({ createdAt: -1 }).limit(5).populate('user', 'email'),
        QuotationRequest.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'email'),
        QuotationOffer.find().sort({ createdAt: -1 }).limit(5)
          .populate('vendorProfile', 'vendorName companyName')
          .populate('request', 'title'),
      ]);

      const activities = [];

      recentVendors.forEach(v => {
        activities.push({
          id: v._id,
          type: 'vendor_registered',
          message: `New vendor "${v.vendorName}" (${v.companyName}) registered`,
          user: v.user?.email || 'Unknown',
          createdAt: v.createdAt,
        });
      });

      recentRequests.forEach(r => {
        activities.push({
          id: r._id,
          type: 'request_created',
          message: `New quotation request "${r.title}" created`,
          user: r.createdBy?.email || 'Admin',
          createdAt: r.createdAt,
        });
      });

      recentOffers.forEach(o => {
        const statusEmoji = o.status === 'approved' ? '✅' : o.status === 'rejected' ? '❌' : '⏳';
        activities.push({
          id: o._id,
          type: 'offer_submitted',
          message: `Offer of $${o.amount.toFixed(2)} submitted by "${o.vendorProfile?.vendorName || 'Vendor'}" for "${o.request?.title || 'Request'}" ${statusEmoji}`,
          user: o.vendorProfile?.vendorName || 'Vendor',
          createdAt: o.createdAt,
        });
      });

      activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      stats.recentActivities = activities.slice(0, 10);

    } else {
      // Vendor
      const vendorProfile = req.user.profile;
      if (!vendorProfile) {
        return res.status(404).json({ message: 'Vendor profile not found' });
      }

      const [myOffers, openRequests] = await Promise.all([
        QuotationOffer.find({ vendorProfile: vendorProfile._id }),
        QuotationRequest.countDocuments({ status: 'open' }),
      ]);

      const pending = myOffers.filter(o => o.status === 'pending').length;
      const approved = myOffers.filter(o => o.status === 'approved').length;
      const rejected = myOffers.filter(o => o.status === 'rejected').length;

      stats = {
        totalOffers: myOffers.length,
        pendingOffers: pending,
        approvedOffers: approved,
        rejectedOffers: rejected,
        openRequests,
      };

      const recentOffers = await QuotationOffer.find({ vendorProfile: vendorProfile._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('request', 'title status');

      const activities = recentOffers.map(o => {
        const statusEmoji = o.status === 'approved' ? '✅' : o.status === 'rejected' ? '❌' : '⏳';
        return {
          id: o._id,
          type: 'my_offer',
          message: `Offer of $${o.amount.toFixed(2)} for "${o.request?.title || 'Request'}" is ${o.status} ${statusEmoji}`,
          user: req.user.email,
          createdAt: o.createdAt,
        };
      });

      stats.recentActivities = activities;
    }

    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: error.message });
  }
};