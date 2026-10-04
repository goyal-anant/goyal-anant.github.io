CREATE TABLE IF NOT EXISTS reactions (
  post TEXT NOT NULL,
  kind TEXT NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (post, kind)
);
