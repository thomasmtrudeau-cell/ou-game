-- =============================================
-- OVER/UNDER APP - SUPABASE SETUP
-- =============================================
-- Copy and paste this entire script into:
-- Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- =============================================

-- 1. CREATE THE TOPICS TABLE
-- This stores all the cards users will swipe on
create table if not exists topics (
  id text primary key,
  text text not null,
  emoji text not null,
  category text not null,
  vote_over integer default 0,
  vote_under integer default 0,
  vote_ignore integer default 0,
  created_at timestamp with time zone default now()
);

-- 2. ENABLE ROW LEVEL SECURITY
-- This protects your data
alter table topics enable row level security;

-- 3. CREATE POLICIES
-- Allow anyone to read topics (for the app to work)
create policy "Allow public read access"
  on topics for select
  to anon
  using (true);

-- Allow anyone to update vote counts
create policy "Allow public vote updates"
  on topics for update
  to anon
  using (true)
  with check (true);

-- Allow inserts (for the sync script)
create policy "Allow public inserts"
  on topics for insert
  to anon
  with check (true);

-- 4. CREATE THE VOTE FUNCTION
-- This increments the vote counter and returns updated stats
create or replace function vote_and_get_stats(
  topic_id text,
  vote_column text
)
returns json
language plpgsql
security definer
as $$
declare
  result record;
  total_votes integer;
  over_percent integer;
begin
  -- Increment the appropriate column
  execute format(
    'update topics set %I = %I + 1 where id = $1',
    vote_column, vote_column
  ) using topic_id;

  -- Get the updated topic
  select * into result from topics where id = topic_id;

  -- Calculate percentage
  total_votes := result.vote_over + result.vote_under;

  if total_votes > 0 then
    over_percent := round((result.vote_over::numeric / total_votes) * 100);
  else
    over_percent := 50;
  end if;

  -- Return the stats as JSON
  return json_build_object(
    'vote_over', result.vote_over,
    'vote_under', result.vote_under,
    'vote_ignore', result.vote_ignore,
    'total_votes', total_votes,
    'overrated_percent', over_percent,
    'underrated_percent', 100 - over_percent
  );
end;
$$;

-- 5. INSERT SOME SAMPLE DATA (Optional - delete if using Google Sheets)
-- This gives you something to test with immediately
insert into topics (id, text, emoji, category) values
  ('1', 'Pineapple on Pizza', '🍕', 'Food'),
  ('2', 'Monday Mornings', '😴', 'Life'),
  ('3', 'Avocado Toast', '🥑', 'Food'),
  ('4', 'Remote Work', '💻', 'Work'),
  ('5', 'TikTok', '📱', 'Social Media'),
  ('6', 'Crypto', '🪙', 'Finance'),
  ('7', 'Oat Milk', '🥛', 'Food'),
  ('8', 'Hustle Culture', '💪', 'Work'),
  ('9', 'Astrology', '⭐', 'Life'),
  ('10', 'True Crime Podcasts', '🎧', 'Entertainment')
on conflict (id) do nothing;

-- =============================================
-- DONE! Your database is ready.
-- =============================================
