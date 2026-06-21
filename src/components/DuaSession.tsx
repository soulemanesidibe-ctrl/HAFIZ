interface DuaSessionProps {
  isOpen: boolean
  onClose: () => void
}

export function DuaSession({ isOpen, onClose }: DuaSessionProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="mx-4 w-full max-w-sm bg-[#1A2332] border border-[#2A3A4F] rounded-2xl p-6 shadow-2xl animate-fadeIn">
        {/* Title */}
        <h2 className="text-[#C9A84C] font-semibold text-center text-base tracking-wide uppercase mb-6">
          Dua avant la mémorisation
        </h2>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#C9A84C]/20" />
          <span className="text-[#C9A84C]/50 text-xs">✦</span>
          <div className="flex-1 h-px bg-[#C9A84C]/20" />
        </div>

        {/* Arabic dua */}
        <p
          lang="ar"
          dir="rtl"
          className="text-gray-100 text-center mb-4 leading-loose"
          style={{ fontFamily: 'Amiri, serif', fontSize: '1.4rem', lineHeight: '2.4' }}
        >
          اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي
        </p>

        {/* Transliteration */}
        <p className="text-[#C9A84C]/80 text-sm text-center italic mb-3">
          "Allahumma infa'ni bima 'allamtani wa 'allimni ma yanfa'uni"
        </p>

        {/* Translation */}
        <p className="text-gray-400 text-sm text-center leading-relaxed mb-8">
          "Ô Allah, fais-moi profiter de ce que Tu m'as enseigné et enseigne-moi ce qui m'est utile"
        </p>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full btn-gold py-3 rounded-xl text-base font-semibold"
        >
          Amin — Commencer
        </button>
      </div>
    </div>
  )
}
