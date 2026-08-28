import db from "./db";


export function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);

  return user ? { ...user } : null;
}


export function getUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);

  return user ? { ...user } : null;
}

export function createUser({ username, email, password_hash, first_name, last_name }) {
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash, first_name, last_name)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(username, email, password_hash, first_name, last_name);

  return result.lastInsertRowid;
}


export function updateUserProfile(userId, { first_name, last_name, profile_image }) {
  const stmt = db.prepare(`
    UPDATE users
    SET first_name = ?, last_name = ?, profile_image = COALESCE(?, profile_image)
    WHERE id = ?
  `);
  return stmt.run(first_name, last_name, profile_image, userId);
}

export function updateUserPassword(userId, newHash) {
  const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ? ');
  return stmt.run(newHash, userId);
}


export function getUserById(userId) {
  const stmt = db.prepare(
    'SELECT id, username, first_name, last_name, email, profile_image, password_hash FROM users WHERE id = ?'
  );
  const user = stmt.get(userId);
  return user ? { ...user } : null;
}


export function getPublicUserByUsername(username) {
  const stmt = db.prepare(
    'SELECT id, username, first_name, last_name, profile_image FROM users WHERE username = ?'
  );
  const user = stmt.get(username);
  return user ? { ...user } : null;
}

