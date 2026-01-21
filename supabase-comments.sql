-- Run this in Supabase SQL Editor to add comments feature

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_comments_topic_id ON comments(topic_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Allow public read access to comments"
  ON comments FOR SELECT
  USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Allow public insert access to comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update comments (for upvotes)
CREATE POLICY "Allow public update access to comments"
  ON comments FOR UPDATE
  USING (true);

-- Function to add a comment and return it
CREATE OR REPLACE FUNCTION add_comment(p_topic_id UUID, p_text TEXT)
RETURNS comments AS $$
DECLARE
  new_comment comments;
BEGIN
  INSERT INTO comments (topic_id, text)
  VALUES (p_topic_id, p_text)
  RETURNING * INTO new_comment;

  RETURN new_comment;
END;
$$ LANGUAGE plpgsql;

-- Function to upvote a comment and return updated upvotes
CREATE OR REPLACE FUNCTION upvote_comment(p_comment_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_upvotes INTEGER;
BEGIN
  UPDATE comments
  SET upvotes = upvotes + 1
  WHERE id = p_comment_id
  RETURNING upvotes INTO new_upvotes;

  RETURN new_upvotes;
END;
$$ LANGUAGE plpgsql;
