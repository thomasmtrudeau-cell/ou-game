'use client'

import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { useState } from 'react'

type SwipeDirection = 'left' | 'right' | 'up' | null

interface TopicType {
  id: string
  text: string
  emoji: string
  category: string
}

interface SwipeCardProps {
  topic: TopicType
  onSwipe: (direction: SwipeDirection) => void
  isTop: boolean
  nextTopics?: TopicType[]
}

// Category to glow color mapping
const categoryGlowColors: Record<string, string> = {
  'Pop Culture': 'bg-pink-500/30',
  'Sports': 'bg-green-500/30',
  'Food': 'bg-orange-500/30',
  'Music': 'bg-purple-500/30',
  'Technology': 'bg-cyan-500/30',
  'Movies': 'bg-yellow-500/30',
  'TV': 'bg-indigo-500/30',
  'Social Media': 'bg-blue-500/30',
  'Fashion': 'bg-rose-500/30',
  'Gaming': 'bg-emerald-500/30',
  'default': 'bg-accent/20'
}

function getGlowColor(category: string): string {
  return categoryGlowColors[category] || categoryGlowColors['default']
}

export default function SwipeCard({ topic, onSwipe, isTop, nextTopics = [] }: SwipeCardProps) {
  const [swiped, setSwiped] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Rotation based on horizontal drag
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])

  // Overlay opacities based on drag direction
  const overratedOpacity = useTransform(x, [0, 80], [0, 1])
  const underratedOpacity = useTransform(x, [-80, 0], [1, 0])
  const ignoreOpacity = useTransform(y, [-80, 0], [1, 0])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Prevent double swipes
    if (swiped) return

    const threshold = 50
    const velocityThreshold = 200

    const swipeRight = info.offset.x > threshold || info.velocity.x > velocityThreshold
    const swipeLeft = info.offset.x < -threshold || info.velocity.x < -velocityThreshold
    const swipeUp = info.offset.y < -threshold || info.velocity.y < -velocityThreshold

    if (swipeUp && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      setSwiped(true)
      onSwipe('up')
      animate(y, -1000, { type: 'spring', stiffness: 400, damping: 30 })
    } else if (swipeRight) {
      setSwiped(true)
      onSwipe('right')
      animate(x, 1000, { type: 'spring', stiffness: 400, damping: 30 })
    } else if (swipeLeft) {
      setSwiped(true)
      onSwipe('left')
      animate(x, -1000, { type: 'spring', stiffness: 400, damping: 30 })
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 600, damping: 30 })
      animate(y, 0, { type: 'spring', stiffness: 600, damping: 30 })
    }
  }

  // Stacked dummy cards (not interactive)
  if (!isTop) {
    return null
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Card stack container */}
      <div className="relative">
        {/* Card 2 (furthest back) - shows 2nd next topic */}
        {nextTopics[1] && (
          <div
            className="absolute left-1/2 top-1/2 z-0 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%) translate(8px, 16px) rotate(3deg)' }}
          >
            <div className="swipe-card opacity-40 border-border/50 flex items-center justify-center">
              <span className="text-8xl opacity-60">{nextTopics[1].emoji}</span>
            </div>
          </div>
        )}

        {/* Card 1 (middle) - shows next topic */}
        {nextTopics[0] && (
          <div
            className="absolute left-1/2 top-1/2 z-10 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%) translate(4px, 8px) rotate(1.5deg)' }}
          >
            <div className="swipe-card opacity-60 border-border/50 flex items-center justify-center">
              <span className="text-8xl opacity-70">{nextTopics[0].emoji}</span>
            </div>
          </div>
        )}

        {/* Main interactive card */}
        <motion.div
          className="relative z-20 cursor-grab active:cursor-grabbing"
          style={{ x, y, rotate, touchAction: 'none' }}
          drag={!swiped}
          dragElastic={1}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
        >
          {/* Glow effect behind card - color based on category */}
          <div className={`absolute inset-0 rounded-3xl ${getGlowColor(topic.category)} blur-2xl scale-110 pointer-events-none`} />

          <div className="swipe-card relative overflow-hidden">
            {/* Overrated overlay (Red) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-600/40 rounded-3xl flex items-center justify-center"
              style={{ opacity: overratedOpacity }}
            >
              <span className="text-4xl font-black text-red-400 -rotate-12 border-4 border-red-400 px-4 py-2 rounded-xl">
                OVERRATED
              </span>
            </motion.div>

            {/* Underrated overlay (Blue) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-bl from-blue-500/30 to-blue-600/40 rounded-3xl flex items-center justify-center"
              style={{ opacity: underratedOpacity }}
            >
              <span className="text-4xl font-black text-blue-400 rotate-12 border-4 border-blue-400 px-4 py-2 rounded-xl">
                UNDERRATED
              </span>
            </motion.div>

            {/* Skip overlay (Grey) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-gray-500/30 to-gray-600/40 rounded-3xl flex items-center justify-center"
              style={{ opacity: ignoreOpacity }}
            >
              <span className="text-4xl font-black text-gray-400 border-4 border-gray-400 px-6 py-2 rounded-xl">
                SKIP
              </span>
            </motion.div>

            {/* Card content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
              <span className="text-[10rem] leading-none mb-2 drop-shadow-lg">{topic.emoji}</span>
              <h2 className="text-2xl font-black text-center text-foreground leading-none tracking-tight uppercase">
                {topic.text}
              </h2>
              <span className="mt-3 text-xs text-foreground-muted uppercase tracking-widest">
                {topic.category}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Swipe direction legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 text-lg">←</span>
          <span className="text-blue-400 font-semibold">UNDERRATED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-lg">↑</span>
          <span className="text-gray-400 font-semibold">SKIP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-red-400 font-semibold">OVERRATED</span>
          <span className="text-red-400 text-lg">→</span>
        </div>
      </div>
    </div>
  )
}
