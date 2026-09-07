-- Swift Delicacies — Supabase/Postgres schema
--
-- Run this once, in order, via the Supabase SQL Editor, against a fresh project.
-- This is the single source of truth for the database structure — if you ever
-- need to recreate the database (new environment, disaster recovery, a
-- collaborator's own Supabase project), paste this whole file into the SQL
-- Editor and run it top to bottom.

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  summary TEXT NOT NULL,
  instructions TEXT NOT NULL,
  creator TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  -- SET NULL (not CASCADE): deleting a user's account should not delete
  -- the meals they shared — they remain, just unlinked from any account,
  -- same as meals seeded without a real user behind them.
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  meal_id BIGINT NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Self-referencing parent_id: a reply is just a comment whose parent_id
  -- points at another comment. NULL parent_id = top-level comment.
  parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE likes (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  meal_id BIGINT REFERENCES meals(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, meal_id)
);

CREATE TABLE views (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  meal_id BIGINT REFERENCES meals(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, meal_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL
);

-- ─────────────────────────────────────────────
-- Grants
--
-- Newly created tables need explicit privileges granted to the
-- service_role (the role your app's SUPABASE_SERVICE_ROLE_KEY
-- authenticates as). Without these, every query fails with
-- "permission denied for table X" (Postgres error 42501).
-- ─────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Apply the same grants automatically to any table created in the
-- future, so this permission issue never has to be debugged again.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO service_role;