import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export type Topic = {
  id: string
  text: string
  emoji: string
  category: string
  vote_over: number
  vote_under: number
  vote_ignore: number
  created_at: string
}

export type VoteType = 'over' | 'under' | 'ignore'

export type Comment = {
  id: string
  topic_id: string
  text: string
  upvotes: number
  created_at: string
}

// Vote on a topic and get updated stats
export async function voteTopic(topicId: string, voteType: VoteType) {
  const columnMap = {
    over: 'vote_over',
    under: 'vote_under',
    ignore: 'vote_ignore'
  }

  const column = columnMap[voteType]

  // Call the RPC function to increment and return updated stats
  const { data, error } = await supabase.rpc('vote_and_get_stats', {
    topic_id: topicId,
    vote_column: column
  })

  if (error) throw error
  return data
}

// Fetch random topics, optionally excluding certain categories
export async function getTopics(excludeCategories: string[] = []) {
  let query = supabase
    .from('topics')
    .select('*')

  if (excludeCategories.length > 0) {
    query = query.not('category', 'in', `(${excludeCategories.join(',')})`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Topic[]
}

// Get leaderboard data
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('topics')
    .select('*')

  if (error) throw error

  const topics = data as Topic[]

  // Calculate percentages and sort
  const withPercentages = topics
    .filter(t => (t.vote_over + t.vote_under) > 0) // Only topics with votes
    .map(t => ({
      ...t,
      overrated_percent: Math.round((t.vote_over / (t.vote_over + t.vote_under)) * 100)
    }))

  const mostOverrated = [...withPercentages]
    .sort((a, b) => b.overrated_percent - a.overrated_percent)
    .slice(0, 10)

  const mostUnderrated = [...withPercentages]
    .sort((a, b) => a.overrated_percent - b.overrated_percent)
    .slice(0, 10)

  return { mostOverrated, mostUnderrated }
}

// Get comments for a topic, sorted by upvotes
export async function getComments(topicId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('topic_id', topicId)
    .order('upvotes', { ascending: false })
    .limit(20)

  if (error) throw error
  return data as Comment[]
}

// Add a comment to a topic
export async function addComment(topicId: string, text: string) {
  const { data, error } = await supabase.rpc('add_comment', {
    p_topic_id: topicId,
    p_text: text
  })

  if (error) throw error
  return data as Comment
}

// Upvote a comment
export async function upvoteComment(commentId: string) {
  const { data, error } = await supabase.rpc('upvote_comment', {
    p_comment_id: commentId
  })

  if (error) throw error
  return data as number
}
