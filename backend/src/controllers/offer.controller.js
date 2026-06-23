const emailService = require('../services/email.service');
const QuotationOffer = require('../models/QuotationOffer');
const QuotationRequest = require('../models/QuotationRequest');
const { logActivity } = require('../middleware/activity.middleware');

// @desc    Get all offers for a specific request
// @route   GET /api/offers/request/:requestId
exports.getOffersByRequest = async (req, res) => {
  try {
    const offers = await QuotationOffer.find({ request: req.params.requestId })
      .populate('vendorProfile', 'vendorName companyName contactNumber')
      .sort({ amount: 1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all offers by the logged-in vendor
// @route   GET /api/offers/my-offers
exports.getMyOffers = async (req, res) => {
  try {
    const offers = await QuotationOffer.find({ vendorProfile: req.user.profile._id })
      .populate('request', 'title description deadline status')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// 🆕 createOffer now checks for expiry and sends email
// ============================================================
exports.createOffer = async (req, res) => {
  try {
    const { requestId, amount, reference } = req.body;

    const request = await QuotationRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Auto‑close if deadline passed
    if (new Date(request.deadline) < new Date()) {
      request.status = 'closed';
      await request.save();
      await QuotationOffer.updateMany(
        { request: request._id, status: 'pending' },
        { status: 'rejected' }
      );
      return res.status(400).json({ message: 'This request has expired and is now closed' });
    }

    if (request.status !== 'open') {
      return res.status(400).json({ message: 'This request is closed or awarded' });
    }

    const existing = await QuotationOffer.findOne({
      request: requestId,
      vendorProfile: req.user.profile._id
    });
    if (existing) {
      return res.status(400).json({ message: 'You already submitted an offer for this request' });
    }

    const offer = await QuotationOffer.create({
      request: requestId,
      vendorProfile: req.user.profile._id,
      amount,
      reference,
      status: 'pending'
    });

    const populated = await offer.populate([
      { path: 'request', select: 'title description' },
      { path: 'vendorProfile', select: 'vendorName companyName' }
    ]);

    // ✅ Send response immediately
    res.status(201).json(populated);

    // ✅ Defer email to avoid blocking / header errors
    setImmediate(() => {
      emailService.sendNewOfferNotification(populated).catch((err) => {
        console.error('❌ Email notification failed:', err.message);
      });
    });

    // ✅ Log activity
    setImmediate(() => {
      logActivity(req, req.user, 'submit_offer', {
        requestId: request._id,
        requestTitle: request.title,
        offerId: offer._id,
        amount: offer.amount,
        reference: offer.reference || 'N/A'
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// ✅ updateOfferStatus with auto‑reject logic
// ============================================================
exports.updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const offer = await QuotationOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    const oldStatus = offer.status;
    offer.status = status;
    await offer.save();

    if (status === 'approved') {
      await QuotationRequest.findByIdAndUpdate(offer.request, { status: 'awarded' });
      await QuotationOffer.updateMany(
        {
          request: offer.request,
          _id: { $ne: offer._id },
          status: 'pending'
        },
        { status: 'rejected' }
      );
    }

    const populated = await offer.populate([
      { path: 'request', select: 'title description' },
      { path: 'vendorProfile', select: 'vendorName companyName' }
    ]);
    res.json(populated);

    // ✅ Log activity
    setImmediate(() => {
      const action = status === 'approved' ? 'approve_offer' : 'reject_offer';
      logActivity(req, req.user, action, {
        offerId: offer._id,
        requestId: offer.request,
        requestTitle: populated.request?.title || 'Unknown',
        vendorName: populated.vendorProfile?.vendorName || 'Unknown',
        amount: offer.amount,
        oldStatus,
        newStatus: status
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// 📊 Comparison data grouped by request
// ============================================================
exports.getComparisonData = async (req, res) => {
  try {
    const offers = await QuotationOffer.find()
      .populate({
        path: 'request',
        select: 'title description deadline status createdBy',
        populate: { path: 'createdBy', select: 'email' }
      })
      .populate('vendorProfile', 'vendorName companyName contactNumber')
      .sort({ createdAt: -1 });

    const grouped = {};
    offers.forEach(offer => {
      if (!offer.request) return;
      const requestId = offer.request._id.toString();
      if (!grouped[requestId]) {
        grouped[requestId] = { request: offer.request, offers: [] };
      }
      grouped[requestId].offers.push(offer);
    });

    const result = Object.values(grouped).map(group => {
      group.offers.sort((a, b) => a.amount - b.amount);
      if (group.offers.length > 0) {
        group.offers[0].isCheapest = true;
      }
      return group;
    });
    result.sort((a, b) => new Date(b.request.createdAt) - new Date(a.request.createdAt));
    res.json(result);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ message: error.message });
  }
};