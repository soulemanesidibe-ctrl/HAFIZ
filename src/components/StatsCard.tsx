import { useEffect, useRef, useState } from 'react'

interface StatsCardProps {
  icon: string
  label: string
  value: number | string
  unit?: string
  highlight?: boolean
  badge?: number
}

/**
 * Carte statistique réutilisable.
 * Affiche une icône, un label et une valeur avec animation countup.
 * Thème sombre, accent doré.
 */
export function StatsCard({ icon, label, value, unit, highlight = false, badge }: StatsCardProps) {
  const [displayed, setDisplayed] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  )
  const animRef = useRef<number | null>(null)
  const prevValue = useRef<number | string>(typeof value === 'number' ? 0 : value)

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayed(value)
      return
    }

    const start = typeof prevValue.current === 'number' ? prevValue.current : 0
    const end = value
    prevValue.current = value

    if (start === end) return

    const duration = 600
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplayed(current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step)
      }
    }

    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(step)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [value])

  return (
    <div
      className={`relative card-dark flex flex-col items-center text-center py-4 px-3 ${
        highlight ? 'border-[#C9A84C]/40' : ''
      }`}
    >
      {/* Badge rouge si des révisions sont dues */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      <span className="text-2xl mb-1">{icon}</span>
      <p className={`font-bold text-xl ${highlight ? 'text-[#C9A84C]' : 'text-gray-100'}`}>
        {displayed}
        {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
      </p>
      <p className="text-gray-500 text-xs mt-0.5 leading-tight">{label}</p>
    </div>
  )
}
