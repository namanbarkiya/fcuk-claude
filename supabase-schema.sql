-- Run this in your Supabase SQL Editor to set up the database.
-- Safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS.

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    username   TEXT        NOT NULL UNIQUE,
    email      TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username   TEXT        NOT NULL,
    content    TEXT        NOT NULL CHECK (char_length(content) <= 500),
    emoji      TEXT        NOT NULL DEFAULT '🤬',
    image_url  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji      TEXT        NOT NULL DEFAULT '👍',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(post_id, user_id, emoji)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_posts_created_at  ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username    ON users(username);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Drop then recreate policies (idempotent)
DROP POLICY IF EXISTS "anon can select users" ON users;
DROP POLICY IF EXISTS "anon can insert users" ON users;
DROP POLICY IF EXISTS "anon can select posts" ON posts;
DROP POLICY IF EXISTS "anon can insert posts" ON posts;
DROP POLICY IF EXISTS "anon can select reactions" ON reactions;
DROP POLICY IF EXISTS "anon can insert reactions" ON reactions;
DROP POLICY IF EXISTS "anon can delete reactions" ON reactions;

CREATE POLICY "anon can select users"
    ON users FOR SELECT TO anon USING (true);

CREATE POLICY "anon can insert users"
    ON users FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select posts"
    ON posts FOR SELECT TO anon USING (true);

CREATE POLICY "anon can insert posts"
    ON posts FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select reactions"
    ON reactions FOR SELECT TO anon USING (true);

CREATE POLICY "anon can insert reactions"
    ON reactions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can delete reactions"
    ON reactions FOR DELETE TO anon USING (true);

-- ============================================================
-- RPC FUNCTIONS (for sorting)
-- ============================================================

-- Popular posts: ordered by reaction count descending
CREATE OR REPLACE FUNCTION get_popular_posts(lim INT, off INT)
RETURNS SETOF posts
LANGUAGE sql STABLE
AS $$
  SELECT p.*
  FROM posts p
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS cnt
    FROM reactions
    GROUP BY post_id
  ) r ON r.post_id = p.id
  ORDER BY COALESCE(r.cnt, 0) DESC, p.created_at DESC
  LIMIT lim OFFSET off;
$$;

-- Longest rants: ordered by content length descending
CREATE OR REPLACE FUNCTION get_longest_posts(lim INT, off INT)
RETURNS SETOF posts
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM posts
  ORDER BY char_length(content) DESC, created_at DESC
  LIMIT lim OFFSET off;
$$;
