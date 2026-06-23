const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs (Admin only)
// @route   GET /api/activities
exports.getActivities = async (req, res) => {
  try {
    const { limit = 50, page = 1, action, user } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (action) query.action = action;
    if (user) query.user = user;

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('user', 'email role'),
      ActivityLog.countDocuments(query),
    ]);

    res.json({
      activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity stats
// @route   GET /api/activities/stats
exports.getActivityStats = async (req, res) => {
  try {
    const [totalLogs, actionCounts, recent] = await Promise.all([
      ActivityLog.countDocuments(),
      ActivityLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'email role'),
    ]);

    res.json({
      totalLogs,
      actionCounts,
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};