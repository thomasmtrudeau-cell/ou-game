'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getLeaderboard } from '@/lib/supabase'
import Link from 'next/link'

type LeaderboardTopic = {
  id: string
  text: string
  emoji: string
  category: string
  vote_over: number
  vote_under: number
  overrated_percent: number
}

export default function LeaderboardPage() {
  const [mostOverrated, setMostOverrated] = useState<LeaderboardTopic[]>([])
  const [mostUnderrated, setMostUnderrated] = useState<LeaderboardTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overrated' | 'underrated'>('overrated')

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard()
        setMostOverrated(data.mostOverrated)
        setMostUnderrated(data.mostUnderrated)
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [])

  const currentList = activeTab === 'overrated' ? mostOverrated : mostUnderrated

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="text-3xl font-black tracking-tight">
          <span className="text-red-400">O</span>
          <span className="text-foreground-muted">/</span>
          <span className="text-blue-400">U</span>
        </Link>
        <Link href="/" className="btn btn-primary text-sm">
          Play
        </Link>
      </header>

      {/* Tab switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('overrated')}
          className={`flex-1 py-4 text-center font-bold transition-colors relative ${
            activeTab === 'overrated'
              ? 'text-red-400'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Most Overrated
          {activeTab === 'overrated' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('underrated')}
          className={`flex-1 py-4 text-center font-bold transition-colors relative ${
            activeTab === 'underrated'
              ? 'text-blue-400'
              : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Most Underrated
          {activeTab === 'underrated' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
            />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-w-lg mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-10 h-10 border-4 border-foreground-muted border-t-accent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🗳️</span>
            <p className="text-foreground-muted">No votes yet. Be the first!</p>
            <Link href="/" className="btn btn-primary mt-4 inline-block">
              Start Voting
            </Link>
          </div>
        ) : (
          <motion.ul
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'overrated' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            {currentList.map((topic, index) => (
              <motion.li
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card flex items-center gap-4"
              >
                {/* Rank */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : index === 1
                      ? 'bg-gray-400/20 text-gray-300'
                      : index === 2
                      ? 'bg-amber-600/20 text-amber-500'
                      : 'bg-background-tertiary text-foreground-muted'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Emoji */}
                <span className="text-3xl">{topic.emoji}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {topic.text}
                  </h3>
                  <p className="text-xs text-foreground-muted">{topic.category}</p>
                </div>

                {/* Percentage */}
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      activeTab === 'overrated' ? 'text-red-400' : 'text-blue-400'
                    }`}
                  >
                    {activeTab === 'overrated'
                      ? topic.overrated_percent
                      : 100 - topic.overrated_percent}
                    %
                  </div>
                  <p className="text-xs text-foreground-muted">
                    {topic.vote_over + topic.vote_under} votes
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </main>
  )
}
