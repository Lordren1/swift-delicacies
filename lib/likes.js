import db from './db';

export async function toggleLike(mealId, userId) {
  const { data: existing } = await db
    .from('likes')
    .select('user_id')
    .eq('user_id', userId)
    .eq('meal_id', mealId)
    .maybeSingle();

  if (existing) {
    await db.from('likes').delete().eq('user_id', userId).eq('meal_id', mealId);
    return false;
  } else {
    await db.from('likes').insert({ user_id: userId, meal_id: mealId });
    return true;
  }
}