const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getOffersByRequest,
  getMyOffers,
  createOffer,
  updateOfferStatus,
  getComparisonData          // <-- NEW import
} = require('../controllers/offer.controller');

const router = express.Router();

router.get('/my-offers', protect, authorize('vendor'), getMyOffers);
router.post('/', protect, authorize('vendor'), createOffer);
router.get('/request/:requestId', protect, getOffersByRequest);
router.get('/comparison', protect, getComparisonData);   // <-- NEW route
router.put('/:id/status', protect, authorize('admin'), updateOfferStatus);

module.exports = router;