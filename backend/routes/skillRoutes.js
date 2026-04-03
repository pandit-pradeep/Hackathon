const express = require('express');
const router = express.Router();
const { 
  addSkill, 
  getSkills, 
  getSkillById, 
  updateSkill, 
  deleteSkill 
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');
const { validateSkill, validate } = require('../middleware/validation');

router.route('/')
  .post(protect, validateSkill, validate, addSkill)
  .get(protect, getSkills);

router.route('/:id')
  .get(protect, getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
