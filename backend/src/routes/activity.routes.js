const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { getActivities, getActivityStats } = require('../controllers/activity.controller');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getActivities);
router.get('/stats', getActivityStats);

module.exports = router;