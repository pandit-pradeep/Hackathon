const skillModel = require('../models/skillModel');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormat');

// @desc    Get dashboard stats
// @route   GET /api/stats/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await skillModel.getStats(req.user.id);
  
  successResponse(res, 200, {
    total_skills: parseInt(stats.total_skills),
    completed_skills: parseInt(stats.completed_skills),
    avg_progress: parseFloat(stats.avg_progress).toFixed(2),
    current_streak: req.user.streak_count,
  }, 'Stats retrieved successfully');
});

module.exports = {
  getDashboardStats,
};
