import { randomBytes } from "node:crypto";
import { cookies } from 'next/headers';
import db from './db';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const RENEWAL_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15; // renew if <15 days left

export async function createAuthSession(userId) {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  const { error } = await db
    .from('sessions')
    .insert({ id: sessionId, user_id: userId, expires_at: expiresAt });

  if (error) throw error;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });
}

export async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return { user: null, session: null };
  }

  const sessionId = sessionCookie.value;

  const { data: session } = await db
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) {

    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // Reading verifyAuth() from a plain Server Component can't write
      // cookies — safe to ignore; the stale cookie gets cleared next
      // time verifyAuth() runs inside an actual Server Action.
    }
    // cookieStore.delete(SESSION_COOKIE_NAME);
    return { user: null, session: null };
  }

  if (Date.now() > session.expires_at) {
    await db.from('sessions').delete().eq('id', sessionId);
    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch { }

    return { user: null, session: null };
  }

  const { data: user } = await db
    .from('users')
    .select('id, username, first_name, last_name, email, profile_image')
    .eq('id', session.user_id)
    .maybeSingle();

  if (!user) {
    await db.from('sessions').delete().eq('id', sessionId);
    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch { }

    return { user: null, session: null };
  }

  const timeRemaining = session.expires_at - Date.now();

  if (timeRemaining < RENEWAL_THRESHOLD_MS) {
    const newExpiresAt = Date.now() + SESSION_DURATION_MS;

    await db
      .from('sessions')
      .update({ expires_at: newExpiresAt })
      .eq('id', sessionId);

    try {
      cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(newExpiresAt),
        path: '/',
      });
    } catch { }

    session.expires_at = newExpiresAt;
  }

  return { user, session };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    await db.from('sessions').delete().eq('id', sessionCookie.value);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}