const crypto = require('crypto');
const { readDb, writeDb } = require('../utils/jsonDb');

const createUser = async (name, email, password) => {
  const db = readDb();
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    streak_count: 0,
    last_activity: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
};

const findUserByEmail = async (email) => {
  const db = readDb();
  return db.users.find(u => u.email === email) || null;
};

const findUserById = async (id) => {
  const db = readDb();
  return db.users.find(u => u.id === id) || null;
};

const updateLastActivityAndStreak = async (id, isNewDay) => {
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  if (isNewDay) {
    db.users[userIndex].streak_count += 1;
  }
  db.users[userIndex].last_activity = new Date().toISOString().split('T')[0];
  
  writeDb(db);
  return db.users[userIndex];
};

const updateUser = async (id, data) => {
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  if (data.name) db.users[userIndex].name = data.name;
  if (data.email) db.users[userIndex].email = data.email;
  // If there's a dreamJob, save it as well
  if (data.dreamJob) db.users[userIndex].dreamJob = data.dreamJob;

  writeDb(db);
  return db.users[userIndex];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateLastActivityAndStreak,
  updateUser
};
