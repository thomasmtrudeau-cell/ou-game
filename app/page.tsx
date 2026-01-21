'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SwipeCard from '@/components/SwipeCard'
import ResultOverlay from '@/components/ResultOverlay'
import { supabase, voteTopic, type Topic, type VoteType } from '@/lib/supabase'
import { playSwipeSound, playIgnoreSound, speakText, stopSpeaking, startMusic, stopMusic, toggleMusic, isMusicPlaying, preloadMusic } from '@/lib/sounds'
import Link from 'next/link'

type SwipeDirection = 'left' | 'right' | 'up' | null

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downRankedCategories, setDownRankedCategories] = useState<string[]>([])
  const [showTutorial, setShowTutorial] = useState(true)

  // Voice toggle (text-to-speech)
  const [voiceOn, setVoiceOn] = useState(false)

  // Music toggle
  const [musicOn, setMusicOn] = useState(false)

  // Result overlay state
  const [showResult, setShowResult] = useState(false)
  const [lastVote, setLastVote] = useState<{
    type: VoteType
    stats: { overrated_percent: number; underrated_percent: number; total_votes: number }
    topic: Topic
  } | null>(null)

  // Check if user has seen tutorial before
  useEffect(() => {
    const seen = localStorage.getItem('overunder_tutorial_seen')
    if (seen) setShowTutorial(false)

    // Load voice preference
    const voicePref = localStorage.getItem('overunder_voice')
    if (voicePref === 'true') setVoiceOn(true)

    // Load music preference (default on)
    const musicPref = localStorage.getItem('overunder_music')
    if (musicPref !== 'false') {
      setMusicOn(true)
    }

    // Preload music files so they play instantly
    preloadMusic()

    // Start music on first click anywhere
    const handleFirstClick = () => {
      const musicPref = localStorage.getItem('overunder_music')
      if (musicPref !== 'false' && !isMusicPlaying()) {
        startMusic()
      }
      document.removeEventListener('click', handleFirstClick)
    }
    document.addEventListener('click', handleFirstClick)

    return () => document.removeEventListener('click', handleFirstClick)
  }, [])

  // Handle voice toggle
  const toggleVoice = () => {
    const newValue = !voiceOn
    setVoiceOn(newValue)
    localStorage.setItem('overunder_voice', String(newValue))
    if (!newValue) {
      stopSpeaking()
    }
  }

  // Handle music toggle
  const handleMusicToggle = () => {
    const isNowPlaying = toggleMusic()
    setMusicOn(isNowPlaying)
    localStorage.setItem('overunder_music', String(isNowPlaying))
  }

  const currentTopic = topics[currentIndex]

  // Speak current topic when card is visible and ready
  useEffect(() => {
    if (!voiceOn || !currentTopic || showResult || showTutorial) {
      return
    }

    // Small delay to ensure card has rendered with correct topic
    const timer = setTimeout(() => {
      stopSpeaking()
      speakText(currentTopic.text)
    }, 150)

    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [currentIndex, voiceOn, showResult, showTutorial])

  const dismissTutorial = () => {
    localStorage.setItem('overunder_tutorial_seen', 'true')
    setShowTutorial(false)
  }

  // Fetch and sort topics with down-ranking
  const fetchTopics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase.from('topics').select('*')

      if (fetchError) throw fetchError

      // Weighted shuffle: down-ranked categories appear less often (pushed toward end)
      const shuffled = (data || []).sort(() => Math.random() - 0.5)

      // Separate into regular and down-ranked
      const regular = shuffled.filter(t => !downRankedCategories.includes(t.category))
      const downRanked = shuffled.filter(t => downRankedCategories.includes(t.category))

      // Interleave: 1 down-ranked topic every ~5 regular topics
      const result: Topic[] = []
      let regularIndex = 0
      let downRankedIndex = 0

      while (regularIndex < regular.length || downRankedIndex < downRanked.length) {
        // Add up to 5 regular topics
        for (let i = 0; i < 5 && regularIndex < regular.length; i++) {
          result.push(regular[regularIndex++])
        }
        // Add 1 down-ranked topic
        if (downRankedIndex < downRanked.length) {
          result.push(downRanked[downRankedIndex++])
        }
      }

      setTopics(result)
      setCurrentIndex(0)
    } catch (err) {
      console.error('Fetch topics error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load topics')
    } finally {
      setLoading(false)
    }
  }, [downRankedCategories])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  // Track if we're currently processing a swipe to prevent double-processing
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSwipe = async (direction: SwipeDirection) => {
    if (!direction || !topics[currentIndex] || isProcessing) return

    setIsProcessing(true)
    const topic = topics[currentIndex]

    // Stop any current speech
    stopSpeaking()

    // Play swipe sound (always on)
    if (direction === 'up') {
      playIgnoreSound()
    } else {
      playSwipeSound(direction)
    }

    // Map swipe direction to vote type
    const voteTypeMap: Record<NonNullable<SwipeDirection>, VoteType> = {
      right: 'over',
      left: 'under',
      up: 'ignore'
    }

    const voteType = voteTypeMap[direction]

    try {
      // Send vote to Supabase
      const stats = await voteTopic(topic.id, voteType)

      // If they ignored, down-rank the category (don't hide completely)
      if (voteType === 'ignore') {
        setDownRankedCategories(prev =>
          prev.includes(topic.category) ? prev : [...prev, topic.category]
        )
      }

      // Show result overlay
      setLastVote({ type: voteType, stats, topic })
      setShowResult(true)
    } catch (err) {
      console.error('Vote error:', err)
      // On error, still show a result with estimated stats
      setLastVote({
        type: voteType,
        stats: { overrated_percent: 50, underrated_percent: 50, total_votes: 0 },
        topic
      })
      setShowResult(true)
    }
  }

  const handleContinue = () => {
    setShowResult(false)
    setLastVote(null)
    setIsProcessing(false)
    setCurrentIndex(prev => prev + 1)
  }

  const isFinished = currentIndex >= topics.length && topics.length > 0

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="text-red-400">O</span>
          <span className="text-foreground-muted">/</span>
          <span className="text-blue-400">U</span>
        </h1>
        <div className="flex items-center gap-2">
          {/* Music toggle */}
          <button
            onClick={handleMusicToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              musicOn
                ? 'bg-accent text-background'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            }`}
            title={musicOn ? 'Music on' : 'Music off'}
          >
            {musicOn ? '🎵' : '🎵'}
          </button>
          {/* Voice toggle (text-to-speech) */}
          <button
            onClick={toggleVoice}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              voiceOn
                ? 'bg-accent text-background'
                : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
            }`}
            title={voiceOn ? 'Voice reading on' : 'Voice reading off'}
          >
            {voiceOn ? '🔊' : '🔇'}
          </button>
          {/* Help button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="w-8 h-8 rounded-full bg-background-tertiary text-foreground-muted hover:text-foreground flex items-center justify-center text-sm font-bold"
            title="How to play"
          >
            ?
          </button>
          <Link
            href="/leaderboard"
            className="btn btn-secondary text-sm"
          >
            Leaderboard
          </Link>
        </div>
      </header>

      {/* Card area */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-12 h-12 border-4 border-foreground-muted border-t-accent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-error mb-4">{error}</p>
              <button onClick={fetchTopics} className="btn btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="text-6xl mb-4 block">🎉</span>
              <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
              <p className="text-foreground-muted mb-6">
                You've voted on all {topics.length} topics
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={fetchTopics} className="btn btn-primary">
                  Start Over
                </button>
                <Link href="/leaderboard" className="btn btn-secondary">
                  View Results
                </Link>
              </div>
            </motion.div>
          </div>
        )}

        {!loading && !error && !isFinished && (
          <div className="absolute inset-0">
            <AnimatePresence>
              {currentTopic && (
                <SwipeCard
                  key={currentTopic.id}
                  topic={currentTopic}
                  onSwipe={handleSwipe}
                  isTop={true}
                  nextTopics={topics.slice(currentIndex + 1, currentIndex + 3)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tutorial overlay for first-time users */}
        <AnimatePresence>
          {showTutorial && !loading && currentTopic && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismissTutorial}
            >
              <motion.div
                className="mx-4 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">How to Play</h2>

                <div className="flex justify-center gap-8 mb-8">
                  {/* Left instruction */}
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-blue-500/30 border-2 border-blue-400 flex items-center justify-center mx-auto mb-3"
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="text-3xl text-blue-400">←</span>
                    </motion.div>
                    <p className="text-blue-400 font-bold text-lg">UNDERRATED</p>
                    <p className="text-foreground-muted text-sm">Swipe Left</p>
                  </div>

                  {/* Up instruction */}
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gray-500/30 border-2 border-gray-400 flex items-center justify-center mx-auto mb-3"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="text-3xl text-gray-400">↑</span>
                    </motion.div>
                    <p className="text-gray-400 font-bold text-lg">SKIP</p>
                    <p className="text-foreground-muted text-sm">Swipe Up</p>
                  </div>

                  {/* Right instruction */}
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-red-500/30 border-2 border-red-400 flex items-center justify-center mx-auto mb-3"
                      animate={{ x: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="text-3xl text-red-400">→</span>
                    </motion.div>
                    <p className="text-red-400 font-bold text-lg">OVERRATED</p>
                    <p className="text-foreground-muted text-sm">Swipe Right</p>
                  </div>
                </div>

                <p className="text-foreground-muted mb-6">Tap anywhere to start</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && lastVote && (
          <ResultOverlay
            voteType={lastVote.type}
            stats={lastVote.stats}
            topic={lastVote.topic}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
