import db from "./db";

export async function recordView(mealId, userId) {
  // Supabase upsert with ignoreDuplicates mimics SQLite's INSERT OR IGNORE —
  // if this (user_id, meal_id) pair already exists, do nothing instead of erroring
  const { error } = await db
    .from('views')
    .upsert(
      { user_id: userId, meal_id: mealId },
      { onConflict: 'user_id,meal_id', ignoreDuplicates: true }
    );

  if (error) throw error;
}

export async function getViewsCount(mealId) {
  const { count, error } = await db
    .from('views')
    .select('*', { count: 'exact', head: true })
    .eq('meal_id', mealId);

  if (error) throw error;
  return count;
}