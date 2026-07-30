-- SQLite doesn't allow UNIQUE directly on ALTER TABLE ADD COLUMN, so the
-- constraint is added as a separate unique index instead.
ALTER TABLE users ADD COLUMN google_id TEXT;
CREATE UNIQUE INDEX idx_users_google_id ON users(google_id);
