import db from './db';



export function toggleLike(mealId, userId) {
  const existing = db
    .prepare('SELECT 1 FROM likes WHERE user_id = ? AND meal_id = ?')
    .get(userId, mealId);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND meal_id = ?').run(userId, mealId);
    return false;
  } else {
    db.prepare('INSERT INTO likes (user_id, meal_id) VALUES (?, ?)').run(userId, mealId);
    return true;
  }

}