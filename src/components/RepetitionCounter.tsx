interface RepetitionCounterProps {
  count: number
  target?: number
  onIncrement: () => void
}

export function RepetitionCounter({ count, target = 20, onIncrement }: RepetitionCounterProps) {
  const isComplete = count >= target
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(count / target, 1)
  const strokeDashoffset = circumference * (1 - progress)
  const activeColor = isComplete ? '#228B4E' : '#C9A84C'

  return (
    <div className="card-dark flex flex-col items-center gap-4 py-6">
      {/* Circular progress */}
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="#2A3A4F"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xl font-bold leading-none"
            style={{ color: activeColor, transition: 'color 0.3s ease' }}
          >
            {count}
          </span>
          <span className="text-gray-500 text-xs">/ {target}</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-gray-400 text-sm">
        {isComplete ? (
          <span style={{ color: '#228B4E' }}>Objectif atteint ✓</span>
        ) : (
          <span>{target - count} répétition{target - count > 1 ? 's' : ''} restante{target - count > 1 ? 's' : ''}</span>
        )}
      </p>

      {/* Increment button */}
      <button
        onClick={onIncrement}
        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl font-light transition-transform active:scale-90 transform"
        style={{
          background: activeColor,
          color: '#0F1419',
        }}
        aria-label="Incrémenter"
      >
        +
      </button>
    </div>
  )
}
