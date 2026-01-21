// Sound effects using Web Audio API
// No external files needed - sounds are synthesized

let audioContext: AudioContext | null = null

// ============================================
// BACKGROUND MUSIC
// ============================================

const MUSIC_TRACKS = [
  '/music/track1.mp3',
  '/music/track2.mp3'
]

let musicPlayer: HTMLAudioElement | null = null
let currentTrackIndex = 0
let musicEnabled = false
let musicStarted = false

export function startMusic() {
  // Prevent multiple starts
  if (musicStarted) return
  musicStarted = true
  musicEnabled = true

  // Randomly pick which track to start with
  currentTrackIndex = Math.random() < 0.5 ? 0 : 1

  musicPlayer = new Audio(MUSIC_TRACKS[currentTrackIndex])
  musicPlayer.volume = 0.3
  musicPlayer.preload = 'auto'

  // When track ends, play the other one
  musicPlayer.addEventListener('ended', () => {
    if (!musicEnabled) return
    currentTrackIndex = currentTrackIndex === 0 ? 1 : 0
    if (musicPlayer) {
      musicPlayer.src = MUSIC_TRACKS[currentTrackIndex]
      musicPlayer.play().catch(() => {})
    }
  })

  musicPlayer.play().catch(() => {
    // Autoplay blocked - will start on first interaction
    musicStarted = false
  })
}

// Preload music files so they're ready to play instantly
export function preloadMusic() {
  MUSIC_TRACKS.forEach(src => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.src = src
  })
}

export function stopMusic() {
  musicEnabled = false
  musicStarted = false
  if (musicPlayer) {
    musicPlayer.pause()
    musicPlayer = null
  }
}

export function isMusicPlaying() {
  return musicEnabled && musicPlayer !== null && !musicPlayer.paused
}

export function toggleMusic(): boolean {
  if (musicEnabled) {
    stopMusic()
    return false
  } else {
    startMusic()
    return true
  }
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

// ============================================
// TEXT-TO-SPEECH - Reads topics out loud
// ============================================

export function speakText(text: string) {
  // Cancel any current speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1.0
  utterance.volume = 1.0

  // Try to use a good voice
  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find(v =>
    v.name.includes('Samantha') ||
    v.name.includes('Google') ||
    v.name.includes('Natural')
  )
  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  window.speechSynthesis.cancel()
}

// ============================================
// SOUND EFFECTS
// ============================================

// Satisfying "whoosh" swipe sound
export function playSwipeSound(direction: 'left' | 'right' | 'up') {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  const baseFreq = direction === 'right' ? 300 : direction === 'left' ? 250 : 200

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    direction === 'up' ? 100 : baseFreq * 1.5,
    ctx.currentTime + 0.15
  )

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.15)
}

// Reaction sound when results show
export function playReactionSound(isAgreement: boolean, isOverrated: boolean) {
  const ctx = getAudioContext()

  if (isAgreement) {
    // Happy ascending chime for agreement
    playChime(ctx, [523, 659, 784], 0.12)
  } else {
    // Surprised "whoa" sound for hot take
    playChime(ctx, [400, 350, 450], 0.15)
  }
}

function playChime(ctx: AudioContext, frequencies: number[], noteDuration: number) {
  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

    const startTime = ctx.currentTime + i * noteDuration
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration)

    oscillator.start(startTime)
    oscillator.stop(startTime + noteDuration)
  })
}

// Skip sound
export function playIgnoreSound() {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(200, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}
