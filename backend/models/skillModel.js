const crypto = require('crypto');
const { readDb, writeDb } = require('../utils/jsonDb');

const createSkill = async (userId, title, category, level, progress, deadline) => {
  const db = readDb();
  const isCompleted = progress === 100;
  const newSkill = {
    id: crypto.randomUUID(),
    user_id: userId,
    title,
    category,
    level,
    progress: progress || 0,
    is_completed: isCompleted,
    deadline: deadline || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.skills.push(newSkill);
  writeDb(db);
  return newSkill;
};

const getSkillsByUser = async (userId, queryParams) => {
  const db = readDb();
  let userSkills = db.skills.filter(s => s.user_id === userId);

  let { category, progress, deadline, page, limit, search, sort } = queryParams;
  
  if (category) {
    userSkills = userSkills.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  
  if (progress !== undefined) {
    if (progress === 'completed') {
      userSkills = userSkills.filter(s => s.is_completed === true);
    } else {
      userSkills = userSkills.filter(s => s.progress === parseInt(progress));
    }
  }

  if (deadline) {
    userSkills = userSkills.filter(s => new Date(s.deadline) <= new Date(deadline));
  }
  
  if (search) {
    userSkills = userSkills.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
  }

  if (sort === 'progress') {
    userSkills.sort((a, b) => b.progress - a.progress);
  } else if (sort === 'deadline') {
    userSkills.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  } else {
    userSkills.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const total = userSkills.length;
  const paginated = userSkills.slice(offset, offset + limit);

  return { data: paginated, total, page, limit, pages: Math.ceil(total / limit) };
};

const getSkillById = async (id, userId) => {
  const db = readDb();
  return db.skills.find(s => s.id === id && s.user_id === userId) || null;
};

const updateSkill = async (id, userId, updates) => {
  const db = readDb();
  const index = db.skills.findIndex(s => s.id === id && s.user_id === userId);
  if (index === -1) return null;

  const skill = db.skills[index];
  
  if (updates.title) skill.title = updates.title;
  if (updates.category) skill.category = updates.category;
  if (updates.level) skill.level = updates.level;
  if (updates.progress !== undefined) {
    skill.progress = parseInt(updates.progress);
    skill.is_completed = skill.progress === 100;
  }
  if (updates.deadline) skill.deadline = updates.deadline;
  skill.updated_at = new Date().toISOString();

  writeDb(db);
  return skill;
};

const deleteSkill = async (id, userId) => {
  const db = readDb();
  const index = db.skills.findIndex(s => s.id === id && s.user_id === userId);
  if (index === -1) return null;

  const deleted = db.skills.splice(index, 1);
  writeDb(db);
  return deleted[0];
};

const getStats = async (userId) => {
  const db = readDb();
  const userSkills = db.skills.filter(s => s.user_id === userId);
  
  const total_skills = userSkills.length;
  const completed_skills = userSkills.filter(s => s.is_completed).length;
  
  const sumProgress = userSkills.reduce((sum, s) => sum + s.progress, 0);
  const avg_progress = total_skills === 0 ? 0 : sumProgress / total_skills;

  return { total_skills, completed_skills, avg_progress };
};

module.exports = {
  createSkill,
  getSkillsByUser,
  getSkillById,
  updateSkill,
  deleteSkill,
  getStats
};
