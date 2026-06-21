import { useState, useEffect } from 'react'

const STORAGE_KEY = 'hafiz_visited'

export function BismillahScreen() {
  const [visible, setVisible] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY)
    if (!visited) {
      setHidden(false)
      // Trigger fadeIn after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    }
  }, [])

  if (hidden) return null

  function handleStart() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    setTimeout(() => setHidden(true), 400)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F1419] transition-opacity duration-400"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-6 px-8 animate-fadeIn">
        {/* Decorative line */}
        <div className="w-16 h-px bg-[#C9A84C]/40" />

        {/* Bismillah in Arabic */}
        <p
          lang="ar"
          dir="rtl"
          className="text-[#C9A84C] font-amiri text-4xl leading-loose text-center"
          style={{ fontFamily: 'Amiri, serif' }}
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        {/* French translation */}
        <p className="text-gray-400 text-sm text-center leading-relaxed max-w-xs">
          Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux
        </p>

        {/* Decorative line */}
        <div className="w-16 h-px bg-[#C9A84C]/40" />

        {/* App name */}
        <div className="text-center mt-2">
          <p
            lang="ar"
            className="text-[#C9A84C] font-amiri text-3xl"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            حافظ
          </p>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Hafiz</p>
        </div>

        {/* CTA button */}
        <button
          onClick={handleStart}
          className="mt-4 btn-gold text-base px-8 py-3 rounded-xl font-semibold shadow-lg"
        >
          Commencer
        </button>
      </div>
    </div>
  )
}
