const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const initDb = () => {
  const dir = path.dirname(dbPath);
  if (!fsSync.existsSync(dir)) {
    fsSync.mkdirSync(dir, { recursive: true });
  }
  if (!fsSync.existsSync(dbPath)) {
    fsSync.writeFileSync(dbPath, JSON.stringify({ users: [], skills: [] }, null, 2));
  }
};

let dbQueue = Promise.resolve();

const lockedTask = (task) => {
  return new Promise((resolve, reject) => {
    dbQueue = dbQueue.then(async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }).catch(err => {
      console.error('JSON DB Queue Error:', err);
    });
  });
};

const queryDb = async (callback) => {
  return lockedTask(async () => {
    const dataStr = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dataStr);
    return await callback(db);
  });
};

const updateDb = async (callback) => {
  return lockedTask(async () => {
    const dataStr = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dataStr);
    const result = await callback(db);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    return result;
  });
};

module.exports = { initDb, queryDb, updateDb };
