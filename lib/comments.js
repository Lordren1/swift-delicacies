import { verifyAuth } from "./auth";
import db from "./db";



export function getComments(mealId) {
  const stmt = db.prepare(`
    SELECT 
      comments.id,
      comments.content,
      comments.created_at,
      comments.user_id,
      comments.parent_id,
      users.username,
      users.first_name,
      users.last_name,
      users.profile_image
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.meal_id = ?
    ORDER BY comments.created_at ASC
    `);
  const rows = stmt.all(mealId).map((row) => ({ ...row }));

  //Build a nested tree: top-level comments with a `replies` array attached
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


export function addComment(mealId, userId, content, parentId = null) {
  const stmt = db.prepare(`
    INSERT INTO comments (meal_id, user_id, content, parent_id)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(mealId, userId, content, parentId);
}

export function updateComment(commentId, userId, content) {

  const stmt = db.prepare(`
    UPDATE comments
    SET content = ?
    WHERE id = ? AND user_id = ?  
  `);
  return stmt.run(content, commentId, userId);
}


export function deleteComment(commentId, userId) {
  const stmt = db.prepare(`
    DELETE FROM comments
    WHERE id = ? AND user_id = ?  
  `);
  return stmt.run(commentId, userId);
}

