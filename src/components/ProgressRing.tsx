import { useEffect, useRef, useState } from 'react'

interface ProgressRingProps {
  /** Progression entre 0 et 1 */
  progress: number
  /** Diamètre du cercle en px */
  size?: number
  /** Épaisseur du trait */
  strokeWidth?: number
  /** Texte principal au centre */
  label?: string
  /** Sous-texte au centre */
  sublabel?: string
}

/**
 * Cercle de progression SVG avec gradient or → vert islamique.
 * Animate sur changement de progress.
 */
export function ProgressRing({
  progress,
  size = 160,
  strokeWidth = 10,
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(1, Math.max(0, progress))

  const [animatedOffset, setAnimatedOffset] = useState(circumference)
  const animRef = useRef<number | null>(null)
  const prevProgress = useRef(0)

  useEffect(() => {
    const startOffset = prevProgress.current * circumference
    const endOffset = clampedProgress * circumference
    prevProgress.current = clampedProgress

    const duration = 800
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      // easeInOut
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const currentOffset = startOffset + (endOffset - startOffset) * eased
      setAnimatedOffset(circumference - currentOffset)

      if (t < 1) {
        animRef.current = requestAnimationFrame(step)
      }
    }

    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(step)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [clampedProgress, circumference])

  const gradientId = `ring-gradient-${size}`
  const center = size / 2

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#228B4E" />
          </linearGradient>
        </defs>

        {/* Piste de fond */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#2A3A4F"
          strokeWidth={strokeWidth}
        />

        {/* Arc de progression */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'none' }}
        />
      </svg>

      {/* Texte central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        {label && (
          <p className="text-gray-100 font-bold leading-tight" style={{ fontSize: size < 120 ? '0.85rem' : '1rem' }}>
            {label}
          </p>
        )}
        {sublabel && (
          <p className="text-gray-500 leading-tight mt-0.5" style={{ fontSize: size < 120 ? '0.6rem' : '0.7rem' }}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}
