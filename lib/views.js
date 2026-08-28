
import db from "./db";


export function recordView(mealId, userId) {

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO views (user_id, meal_id)
    VALUES (?, ?)  
  `);
  stmt.run(userId, mealId);

}


export function getViewsCount(mealId) {
  const stmt = db.prepare('SELECT COUNT(*) AS count FROM views WHERE meal_id = ?');
  return stmt.get(mealId).count;
}


