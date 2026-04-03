const skillModel = require('../models/skillModel');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseFormat');

// @desc    Add a skill
// @route   POST /api/skills
// @access  Private
const addSkill = asyncHandler(async (req, res) => {
  const { title, category, level, progress, deadline } = req.body;

  const skill = await skillModel.createSkill(req.user.id, title, category, level, progress, deadline);

  if (skill) {
    successResponse(res, 201, skill, 'Skill added successfully');
  } else {
    errorResponse(res, 400, 'Invalid skill data');
  }
});

// @desc    Get all skills
// @route   GET /api/skills
// @access  Private
const getSkills = asyncHandler(async (req, res) => {
  const result = await skillModel.getSkillsByUser(req.user.id, req.query);
  successResponse(res, 200, result, 'Skills retrieved successfully');
});

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Private
const getSkillById = asyncHandler(async (req, res) => {
  const skill = await skillModel.getSkillById(req.params.id, req.user.id);

  if (skill) {
    successResponse(res, 200, skill, 'Skill retrieved successfully');
  } else {
    errorResponse(res, 404, 'Skill not found');
  }
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillModel.getSkillById(req.params.id, req.user.id);

  if (!skill) {
    return errorResponse(res, 404, 'Skill not found');
  }

  const updatedSkill = await skillModel.updateSkill(req.params.id, req.user.id, req.body);

  if (updatedSkill) {
    successResponse(res, 200, updatedSkill, 'Skill updated successfully');
  } else {
    errorResponse(res, 400, 'Invalid data to update');
  }
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await skillModel.getSkillById(req.params.id, req.user.id);

  if (!skill) {
    return errorResponse(res, 404, 'Skill not found');
  }

  await skillModel.deleteSkill(req.params.id, req.user.id);

  successResponse(res, 200, null, 'Skill deleted successfully');
});

module.exports = {
  addSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
