const crypto = require('crypto');
const { queryDb, updateDb } = require('../utils/jsonDb');

const createUser = async (name, email, password) => {
  return updateDb((db) => {
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      streak_count: 0,
      last_activity: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      otp: null,
      otp_expires: null
    };
    db.users.push(newUser);
    return newUser;
  });
};

const findUserByEmail = async (email) => {
  return queryDb((db) => {
    return db.users.find(u => u.email === email) || null;
  });
};

const findUserById = async (id) => {
  return queryDb((db) => {
    return db.users.find(u => u.id === id) || null;
  });
};

const updateLastActivityAndStreak = async (id, isNewDay) => {
  return updateDb((db) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    if (isNewDay) {
      db.users[userIndex].streak_count += 1;
    }
    db.users[userIndex].last_activity = new Date().toISOString().split('T')[0];
    
    return db.users[userIndex];
  });
};

const updateUser = async (id, data) => {
  return updateDb((db) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    if (data.name) db.users[userIndex].name = data.name;
    if (data.email) db.users[userIndex].email = data.email;
    if (data.dreamJob) db.users[userIndex].dreamJob = data.dreamJob;

    return db.users[userIndex];
  });
};

const saveLoginAttempt = async (id, attemptId, expires) => {
  return updateDb((db) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex].login_attempt_id = attemptId;
    db.users[userIndex].login_attempt_verified = false;
    db.users[userIndex].login_attempt_expires = expires;
    
    return db.users[userIndex];
  });
};

const authorizeLoginAttempt = async (attemptId) => {
  return updateDb((db) => {
    const userIndex = db.users.findIndex(u => u.login_attempt_id === attemptId);
    if (userIndex === -1) return null;

    if (new Date() > new Date(db.users[userIndex].login_attempt_expires)) {
      return null;
    }

    db.users[userIndex].login_attempt_verified = true;
    return db.users[userIndex];
  });
};

const clearLoginAttempt = async (id) => {
  return updateDb((db) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex].login_attempt_id = null;
    db.users[userIndex].login_attempt_verified = false;
    db.users[userIndex].login_attempt_expires = null;
    
    return db.users[userIndex];
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateLastActivityAndStreak,
  updateUser,
  saveLoginAttempt,
  authorizeLoginAttempt,
  clearLoginAttempt
};
