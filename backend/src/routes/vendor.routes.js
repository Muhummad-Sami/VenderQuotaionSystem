const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendor.controller');

const router = express.Router();

// All vendor routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getVendors)
  .post(createVendor);

router.route('/:id')
  .get(getVendor)
  .put(updateVendor)
  .delete(deleteVendor);

module.exports = router;