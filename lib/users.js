import db from "./db";

export async function getUserByUsername(username) {
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email) {
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createUser({ username, email, password_hash, first_name, last_name }) {
  const { data, error } = await db
    .from('users')
    .insert({ username, email, password_hash, first_name, last_name })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateUserProfile(userId, { first_name, last_name, profile_image }) {
  const updates = { first_name, last_name };
  if (profile_image) updates.profile_image = profile_image; // only overwrite if a new photo was uploaded

  const { error } = await db
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

export async function updateUserPassword(userId, newHash) {
  const { error } = await db
    .from('users')
    .update({ password_hash: newHash })
    .eq('id', userId);

  if (error) throw error;
}

export async function getUserById(userId) {
  const { data, error } = await db
    .from('users')
    .select('id, username, first_name, last_name, email, profile_image, password_hash')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublicUserByUsername(username) {
  const { data, error } = await db
    .from('users')
    .select('id, username, first_name, last_name, profile_image')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return data;
}