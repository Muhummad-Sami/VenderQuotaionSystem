const emailService = require('../services/email.service');
const QuotationRequest = require('../models/QuotationRequest');
const QuotationOffer = require('../models/QuotationOffer');
const { logActivity } = require('../middleware/activity.middleware');

// ============================================================
// HELPER: Auto‑close expired requests
// ============================================================
const closeExpiredRequests = async () => {
  const now = new Date();
  const expiredRequests = await QuotationRequest.find({
    status: 'open',
    deadline: { $lt: now }
  });

  if (expiredRequests.length === 0) return;

  for (const req of expiredRequests) {
    req.status = 'closed';
    await req.save();
    await QuotationOffer.updateMany(
      { request: req._id, status: 'pending' },
      { status: 'rejected' }
    );
  }
  console.log(`🔒 Auto‑closed ${expiredRequests.length} expired request(s)`);
};

// ============================================================
// CONTROLLERS
// ============================================================

// @desc    Get all requests (with filters)
// @route   GET /api/requests
exports.getRequests = async (req, res) => {
  try {
    await closeExpiredRequests();

    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await QuotationRequest.find(query)
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    await closeExpiredRequests();

    const request = await QuotationRequest.findById(req.params.id)
      .populate('createdBy', 'email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new request (Admin only)
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const request = await QuotationRequest.create({
      title,
      description,
      deadline,
      createdBy: req.user._id,
      status: 'open'
    });
    const populated = await request.populate('createdBy', 'email');
    res.status(201).json(populated);

    // ✅ Defer email to avoid blocking / header errors
    setImmediate(() => {
      emailService.sendNewRequestNotification(populated).catch(console.error);
    });

    // ✅ Log activity
    setImmediate(() => {
      logActivity(req, req.user, 'create_request', {
        requestId: populated._id,
        title: populated.title,
        deadline: populated.deadline
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update request status (Admin only)
// @route   PUT /api/requests/:id/status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await QuotationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const oldStatus = request.status;
    request.status = status;
    await request.save();

    if (status === 'closed') {
      await QuotationOffer.updateMany(
        { request: request._id, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json(request);

    // ✅ Log activity
    setImmediate(() => {
      const action = status === 'closed' ? 'close_request' : 'update_request';
      logActivity(req, req.user, action, {
        requestId: request._id,
        title: request.title,
        oldStatus,
        newStatus: status
      }).catch(console.error);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};