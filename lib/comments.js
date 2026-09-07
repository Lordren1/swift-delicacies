import db from "./db";

export async function getComments(mealId) {
  const { data, error } = await db
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      user_id,
      parent_id,
      users ( username, first_name, last_name, profile_image )
    `)
    .eq('meal_id', mealId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Flatten the nested `users` object into the same flat shape as before
  const rows = data.map((row) => ({
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    user_id: row.user_id,
    parent_id: row.parent_id,
    username: row.users?.username,
    first_name: row.users?.first_name,
    last_name: row.users?.last_name,
    profile_image: row.users?.profile_image,
  }));

  // Build a nested tree: top-level comments with a `replies` array attached
  const topLevel = rows.filter((c) => !c.parent_id);
  const repliesByParent = rows.reduce((acc, c) => {
    if (c.parent_id) {
      acc[c.parent_id] = acc[c.parent_id] || [];
      acc[c.parent_id].push(c);
    }
    return acc;
  }, {});

  return topLevel.map((c) => ({ ...c, replies: repliesByParent[c.id] || [] }));
}

export async function addComment(mealId, userId, content, parentId = null) {
  const { error } = await db
    .from('comments')
    .insert({ meal_id: mealId, user_id: userId, content, parent_id: parentId });

  if (error) throw error;
}

export async function updateComment(commentId, userId, content) {
  const { error, count } = await db
    .from('comments')
    .update({ content }, { count: 'exact' })
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw error;
  return { changes: count };
}

export async function deleteComment(commentId, userId) {
  const { error, count } = await db
    .from('comments')
    .delete({ count: 'exact' })
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw error;
  return { changes: count };
}