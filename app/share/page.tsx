'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'

function ShareContent() {
  const searchParams = useSearchParams()

  const emoji = searchParams.get('emoji') || '🤔'
  const topic = searchParams.get('topic') || 'Something'
  const vote = searchParams.get('vote') as 'over' | 'under' | null
  const percent = parseInt(searchParams.get('percent') || '50', 10)

  const isOverrated = vote === 'over'
  const voteLabel = isOverrated ? 'OVERRATED' : 'UNDERRATED'
  const voteColor = isOverrated ? 'text-red-400' : 'text-blue-400'
  const bgColor = isOverrated ? 'bg-red-500/20' : 'bg-blue-500/20'
  const borderColor = isOverrated ? 'border-red-500/30' : 'border-blue-500/30'

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center p-4 border-b border-border">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="text-red-400">O</span>
          <span className="text-foreground-muted">/</span>
          <span className="text-blue-400">U</span>
        </h1>
      </header>

      {/* Share card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className={`${bgColor} ${borderColor} border-2 rounded-3xl p-8 mx-4 text-center max-w-sm w-full`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {/* Topic */}
          <div className="mb-6">
            <span className="text-6xl block mb-4">{emoji}</span>
            <h2 className="text-2xl font-bold text-foreground">{topic}</h2>
          </div>

          {/* Vote result */}
          <div className="mb-6">
            <p className="text-foreground-muted mb-2">Someone voted</p>
            <p className={`text-3xl font-black ${voteColor}`}>{voteLabel}</p>
          </div>

          {/* Percentage bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-400">Underrated</span>
              <span className="text-red-400">Overrated</span>
            </div>
            <div className="h-4 bg-background-tertiary rounded-full overflow-hidden flex">
              <motion.div
                className="bg-blue-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${100 - percent}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
              <motion.div
                className="bg-red-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </div>
            <p className={`text-lg font-bold mt-2 ${voteColor}`}>
              {isOverrated ? percent : 100 - percent}% agree
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="btn btn-primary w-full text-lg py-3"
          >
            Play O/U
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-border">
        <p className="text-foreground-muted text-sm">
          Is it overrated or underrated? You decide.
        </p>
      </div>
    </main>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Loading...</div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  )
}
