import { DatabaseSync } from 'node:sqlite';



const db = new DatabaseSync('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const stmt = db.prepare('SELECT * FROM meals');
  return stmt.all();
}

export function getMeal(slug) {
  const stmt = db.prepare('SELECT * FROM meals WHERE slug = ?');
  return stmt.get(slug);
}