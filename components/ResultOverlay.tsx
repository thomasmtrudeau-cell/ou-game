'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playReactionSound } from '@/lib/sounds'
import { Topic, Comment, getComments, addComment, upvoteComment } from '@/lib/supabase'

interface ResultOverlayProps {
  voteType: 'over' | 'under' | 'ignore'
  stats: {
    overrated_percent: number
    underrated_percent: number
    total_votes: number
  }
  topic: Topic
  onContinue: () => void
}

export default function ResultOverlay({ voteType, stats, topic, onContinue }: ResultOverlayProps) {
  const [shared, setShared] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())

  const userVotedOver = voteType === 'over'
  const majorityVotedOver = stats.overrated_percent > 50
  const isAgreement = voteType !== 'ignore' && userVotedOver === majorityVotedOver

  // Play reaction sound when overlay appears
  useEffect(() => {
    if (voteType !== 'ignore') {
      playReactionSound(isAgreement, userVotedOver)
    }
  }, [voteType, isAgreement, userVotedOver])

  // Fetch comments when overlay appears
  useEffect(() => {
    if (voteType !== 'ignore') {
      getComments(topic.id)
        .then(setComments)
        .catch(() => {
          // Comments table may not exist yet - silently ignore
        })
    }
  }, [topic.id, voteType])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    try {
      const comment = await addComment(topic.id, newComment.trim())
      if (comment) {
        setComments(prev => [comment, ...prev])
        setNewComment('')
      }
    } catch {
      // Comments table may not exist yet - silently ignore
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (commentId: string) => {
    if (upvotedIds.has(commentId)) return

    try {
      const newUpvotes = await upvoteComment(commentId)
      if (typeof newUpvotes === 'number') {
        setComments(prev =>
          prev.map(c =>
            c.id === commentId ? { ...c, upvotes: newUpvotes } : c
          ).sort((a, b) => b.upvotes - a.upvotes)
        )
        setUpvotedIds(prev => new Set(prev).add(commentId))
      }
    } catch {
      // Comments table may not exist yet - silently ignore
    }
  }

  const getMessage = () => {
    if (voteType === 'ignore') {
      return {
        title: "Skipped!",
        subtitle: "You'll see less of this type",
        emoji: '',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/30'
      }
    }

    // Percent of people who agree with user's vote
    const agreePercent = userVotedOver ? stats.overrated_percent : stats.underrated_percent

    // 0-9%: Jail
    if (agreePercent < 10) {
      return {
        title: 'Jail.',
        subtitle: `Only ${agreePercent}% agree with you`,
        emoji: '👮‍♂️',
        color: 'text-red-500',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30'
      }
    }

    // 10-24%: Seek Help
    if (agreePercent < 25) {
      return {
        title: 'Seek Help',
        subtitle: `Only ${agreePercent}% agree with you`,
        emoji: '🚑',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30'
      }
    }

    // 25-39%: Edgelord
    if (agreePercent < 40) {
      return {
        title: 'Edgelord',
        subtitle: `${agreePercent}% agree with you`,
        emoji: '🗡️',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30'
      }
    }

    // 40-59%: Civil War
    if (agreePercent < 60) {
      return {
        title: 'Civil War',
        subtitle: `${agreePercent}% agree - it's controversial`,
        emoji: '⚔️',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30'
      }
    }

    // 60-74%: Valid
    if (agreePercent < 75) {
      return {
        title: 'Valid',
        subtitle: `${agreePercent}% agree with you`,
        emoji: '✅',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30'
      }
    }

    // 75-89%: NPC Energy
    if (agreePercent < 90) {
      return {
        title: 'NPC Energy',
        subtitle: `${agreePercent}% agree with you`,
        emoji: '🤖',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30'
      }
    }

    // 90-100%: Basic Bitch
    return {
      title: 'Basic Bitch',
      subtitle: `${agreePercent}% agree with you`,
      emoji: '💅',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation() // Don't trigger onContinue

    const voteText = userVotedOver ? 'OVERRATED' : 'UNDERRATED'
    const percent = userVotedOver ? stats.overrated_percent : stats.underrated_percent

    // Build share URL with query params
    const shareUrl = new URL('/share', window.location.origin)
    shareUrl.searchParams.set('emoji', topic.emoji)
    shareUrl.searchParams.set('topic', topic.text)
    shareUrl.searchParams.set('vote', userVotedOver ? 'over' : 'under')
    shareUrl.searchParams.set('percent', String(stats.overrated_percent))

    const shareText = `${topic.emoji} ${topic.text}\n\nI said ${voteText} and ${percent}% agree!`

    // Try native share first (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'O/U',
          text: shareText,
          url: shareUrl.toString()
        })
        setShared(true)
        return
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText + '\n\n' + shareUrl.toString())
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const message = getMessage()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onContinue}
    >
      <motion.div
        className={`${message.bgColor} ${message.borderColor} border-2 rounded-3xl p-8 mx-4 text-center max-w-sm`}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topic being voted on */}
        <div className="mb-4">
          <span className="text-4xl">{topic.emoji}</span>
          <p className="text-foreground font-semibold mt-2">{topic.text}</p>
        </div>

        <motion.div
          className="mb-2"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
        >
          {message.emoji && <span className="text-5xl block mb-2">{message.emoji}</span>}
          <h2 className={`text-3xl font-black ${message.color}`}>{message.title}</h2>
        </motion.div>
        <p className="text-foreground-muted text-lg mb-6">{message.subtitle}</p>

        {voteType !== 'ignore' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-400">Underrated</span>
              <span className="text-red-400">Overrated</span>
            </div>
            <div className="h-3 bg-background-tertiary rounded-full overflow-hidden flex">
              <motion.div
                className="bg-blue-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.underrated_percent}%` }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <motion.div
                className="bg-red-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.overrated_percent}%` }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            </div>
            <p className="text-foreground-muted text-sm mt-2">
              {stats.total_votes.toLocaleString()} votes
            </p>
          </div>
        )}

        {/* Comments section */}
        {voteType !== 'ignore' && (
          <div className="mb-4" onClick={(e) => e.stopPropagation()}>
            {/* Add comment form */}
            <form onSubmit={handleSubmitComment} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a hot take..."
                className="flex-1 px-3 py-2 bg-background-tertiary rounded-lg text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
                maxLength={100}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-3 py-2 bg-accent text-background rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? '...' : 'Post'}
              </button>
            </form>

            {/* Comments list */}
            {comments.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-2">
                {comments.slice(0, 5).map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-2 text-left bg-background-tertiary/50 rounded-lg p-2"
                  >
                    <button
                      onClick={() => handleUpvote(comment.id)}
                      className={`flex flex-col items-center px-1.5 py-0.5 rounded text-xs ${
                        upvotedIds.has(comment.id)
                          ? 'text-accent'
                          : 'text-foreground-muted hover:text-accent'
                      }`}
                    >
                      <span>▲</span>
                      <span>{comment.upvotes}</span>
                    </button>
                    <p className="text-sm text-foreground flex-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Share button */}
        {voteType !== 'ignore' && (
          <motion.button
            onClick={handleShare}
            className="btn btn-secondary w-full mb-4 flex items-center justify-center gap-2 text-sm"
            whileTap={{ scale: 0.95 }}
          >
            {shared ? (
              <>
                <span>✓</span> Copied!
              </>
            ) : (
              <>
                <span>📤</span> Share
              </>
            )}
          </motion.button>
        )}

        <button
          onClick={onContinue}
          className="w-full py-3 text-foreground-muted text-sm hover:text-foreground transition-colors"
        >
          Tap to continue →
        </button>
      </motion.div>
    </motion.div>
  )
}
