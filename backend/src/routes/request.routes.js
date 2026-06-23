const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus
} = require('../controllers/request.controller');

const router = express.Router();

// Public (authenticated) routes
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);

// Admin-only routes
router.post('/', protect, authorize('admin'), createRequest);
router.put('/:id/status', protect, authorize('admin'), updateRequestStatus);

module.exports = router;