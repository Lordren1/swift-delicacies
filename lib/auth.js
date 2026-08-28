import { randomBytes } from "node:crypto";
import { cookies } from 'next/headers';
import db from './db';


const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const RENEWAL_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 15; // renew if <15 days left


export async function createAuthSession(userId) {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  const stmt = db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  );
  stmt.run(sessionId, userId, expiresAt);

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

  const session = db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .get(sessionId);

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { user: null, session: null };
  }

  if (Date.now() > session.expires_at) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { user: null, session: null };
  }

  const user = db
    .prepare('SELECT id, username, first_name, last_name, email, profile_image FROM users WHERE id = ?')
    .get(session.user_id);

  if (!user) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    cookieStore.delete(SESSION_COOKIE_NAME);

    return { user: null, session: null };
  }

  const timeRemaining = session.expires_at - Date.now();

  if (timeRemaining < RENEWAL_THRESHOLD_MS) {
    const newExpiresAt = Date.now() + SESSION_DURATION_MS;
    db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?').run(
      newExpiresAt,
      sessionId
    );

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(newExpiresAt),
      path: '/',
    });
    session.expires_at = newExpiresAt;
  }

  return { user: { ...user }, session: { ...session } };
}


export async function destroySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionCookie.value);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}