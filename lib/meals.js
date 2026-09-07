import db from './db';

function shapeMeal(meal, userId) {
  return {
    ...meal,
    creator_username: meal.users?.username ?? null,
    creator_avatar: meal.users?.profile_image ?? null,
    like_count: meal.likes?.length ?? 0,
    liked: meal.likes?.some((l) => l.user_id === userId) ?? false,
    view_count: meal.views?.length ?? 0,
    comment_count: meal.comments?.length ?? 0,
  };
}

export async function getMeals(userId) {
  const { data, error } = await db
    .from('meals')
    .select(`
      *,
      users:user_id ( username, profile_image ),
      likes ( user_id ),
      views ( user_id ),
      comments ( id )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((meal) => shapeMeal(meal, userId));
}

export async function getMeal(slug, userId) {
  const { data, error } = await db
    .from('meals')
    .select(`
      *,
      users:user_id ( username, profile_image ),
      likes ( user_id ),
      views ( user_id ),
      comments ( id )
    `)
    .eq('slug', slug)
    .single();

  if (error) return null;

  return shapeMeal(data, userId);
}

export async function getMealsByUser(profileUserId, viewingUserId) {
  const { data, error } = await db
    .from('meals')
    .select(`
      *,
      users:user_id ( username, profile_image ),
      likes ( user_id ),
      views ( user_id ),
      comments ( id )
    `)
    .eq('user_id', profileUserId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((meal) => shapeMeal(meal, viewingUserId));
}

export async function storeMeal(meal) {
  const { error } = await db.from('meals').insert({
    slug: meal.slug,
    title: meal.title,
    image: meal.image,
    summary: meal.summary,
    instructions: meal.instructions,
    creator: meal.creator,
    creator_email: meal.creator_email,
    user_id: meal.userId,
  });

  if (error) throw error;
}

export async function deleteMeal(mealId, userId) {
  const { error, count } = await db
    .from('meals')
    .delete({ count: 'exact' })
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) throw error;
  return { changes: count };
}

export async function updateMeal(mealId, userId, { title, summary, instructions, image }) {
  const updates = { title, summary, instructions };
  if (image) updates.image = image; // only overwrite image if a new one was actually uploaded

  const { error, count } = await db
    .from('meals')
    .update(updates, { count: 'exact' })
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) throw error;
  return { changes: count };
}