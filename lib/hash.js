import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedkey = await scryptAsync(password, salt, 64);

  return `${salt}:${derivedkey.toString('hex')}`;
}


export async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scryptAsync(password, salt, 64);

  return timingSafeEqual(keyBuffer, derivedKey);
}


