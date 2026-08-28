import db from './db';


export async function getMeals(userId) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const stmt = db.prepare(`
    SELECT 
      meals.*,
      users.username AS creator_username,
      users.profile_image AS creator_avator,
      COUNT(DISTINCT likes.user_id) AS like_count,
      MAX(CASE WHEN likes.user_id = ? THEN 1 ELSE 0 END) AS liked,
      COUNT(DISTINCT views.user_id) AS view_count,
      COUNT(DISTINCT comments.id) AS comment_count
    FROM meals
    LEFT JOIN users ON users.id = meals.user_id
    LEFT JOIN likes ON likes.meal_id = meals.id
    LEFT JOIN views ON views.meal_id = meals.id
    LEFT JOIN comments ON comments.meal_id = meals.id
    GROUP BY meals.id
    ORDER BY meals.created_at DESC
    `);
  return stmt.all(userId ?? -1).map((row) => ({ ...row }));
}

export function getMeal(slug, userId) {
  const stmt = db.prepare(`
    SELECT 
      meals.*, 
      users.username AS creator_username,
      users.profile_image AS creator_avatar,
      COUNT(DISTINCT likes.user_id) AS like_count,
      MAX(CASE WHEN likes.user_id = ? THEN 1 ELSE 0 END) AS liked,
      COUNT(DISTINCT views.user_id) AS view_count,
      COUNT(DISTINCT comments.id) AS comment_count
    FROM meals
    LEFT JOIN users ON users.id = meals.user_id
    LEFT JOIN likes ON likes.meal_id = meals.id
    LEFT JOIN views ON views.meal_id = meals.id
    LEFT JOIN comments ON comments.meal_id = meals.id
    WHERE meals.slug = ?
    GROUP BY meals.id
  `);
  const row = stmt.get(userId ?? -1, slug);
  return row ? { ...row } : row;
}

export function getMealsByUser(profileUserId, viewingUserId) {
  const stmt = db.prepare(`
    SELECT
      meals.*, 
      users.username AS creator_username,
      users.profile_image AS creator_avatar,
      COUNT(DISTINCT likes.user_id) AS like_count,
      MAX(CASE WHEN likes.user_id = ? THEN 1 ELSE 0 END) AS liked,
      COUNT(DISTINCT views.user_id) AS view_count,
      COUNT(DISTINCT comments.id) AS comment_count
    FROM meals
    LEFT JOIN users ON users.id = meals.user_id
    LEFT JOIN likes ON likes.meal_id = meals.id
    LEFT JOIN views ON views.meal_id = meals.id
    LEFT JOIN comments ON comments.meal_id = meals.id
    Where meals.user_id = ?
    GROUP BY meals.id
    ORDER BY meals.created_at DESC 
  `);
  return stmt.all(viewingUserId ?? -1, profileUserId).map((row) => ({ ...row }));
}

export async function storeMeal(meal) {
  const stmt = db.prepare(` 
    INSERT INTO meals (
      slug,
      title,
      image,
      summary,
      instructions,
      creator,
      creator_email,
      user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(
    meal.slug,
    meal.title,
    meal.image,
    meal.summary,
    meal.instructions,
    meal.creator,
    meal.creator_email,
    meal.userId
  );
}

export function deleteMeal(mealId, userId) {
  const stmt = db.prepare('DELETE FROM meals WHERE id = ? AND user_id = ?');
  return stmt.run(mealId, userId);
}

export function updateMeal(mealId, userId, { title, summary, instructions, image }) {
  const stmt = db.prepare(`
    UPDATE meals
    SET title = ?, summary = ?, instructions = ?, image = COALESCE(?, image)
    WHERE id = ? AND user_id = ?
  `);
  return stmt.run(title, summary, instructions, image, mealId, userId);
}