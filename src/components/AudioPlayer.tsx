import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  audioUrl: string
  verseRef: string
  reciterName: string
}

const SPEEDS = [0.75, 1, 1.25] as const
type Speed = (typeof SPEEDS)[number]

export function AudioPlayer({ audioUrl, verseRef, reciterName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState<Speed>(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  function handleSpeedChange() {
    const audio = audioRef.current
    if (!audio) return
    const idx = SPEEDS.indexOf(speed)
    const next = SPEEDS[(idx + 1) % SPEEDS.length]
    setSpeed(next)
    audio.playbackRate = next
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = parseFloat(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
  }

  function formatTime(s: number) {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="card-dark">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Reciter info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <span className="text-[#C9A84C] text-sm">🎙</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-100 text-sm font-medium truncate">{reciterName}</p>
          <p className="text-gray-500 text-xs">{verseRef}</p>
        </div>
        {/* Speed toggle */}
        <button
          onClick={handleSpeedChange}
          className="text-xs font-semibold px-2 py-1 rounded-md border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
        >
          {speed}x
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #C9A84C ${progress}%, #2A3A4F ${progress}%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-gray-500 text-xs">{formatTime(currentTime)}</span>
          <span className="text-gray-500 text-xs">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play / Pause */}
      <div className="flex justify-center">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center hover:bg-[#B8962E] transition-colors active:scale-95 transform"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0F1419" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0F1419" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
