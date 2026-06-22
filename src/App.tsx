import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNavBar } from './components/BottomNavBar'
import { BismillahScreen } from './components/BismillahScreen'
import { HomePage } from './pages/HomePage'
import { AlphabetPage } from './pages/AlphabetPage'
import { TajweedPage } from './pages/TajweedPage'
import { HifzPage } from './pages/HifzPage'
import { SurahStudyPage } from './pages/SurahStudyPage'
import { RevisionPage } from './pages/RevisionPage'
import { useAuthStore } from './store/authStore'
import { useProgressSync } from './hooks/useProgressSync'

/**
 * Composant interne monté dans le Router : initialise l'auth au montage et
 * active la synchronisation cloud (no-op si Supabase n'est pas configuré).
 */
function AppShell() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    void init()
  }, [init])

  // Monte la synchro à la racine pour que les abonnements vivent toute la session.
  useProgressSync()

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-inter">
      <BismillahScreen />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alphabet" element={<AlphabetPage />} />
          <Route path="/tajweed" element={<TajweedPage />} />
          <Route path="/hifz" element={<HifzPage />} />
          <Route path="/hifz/:surahNumber" element={<SurahStudyPage />} />
        <Route path="/revision" element={<RevisionPage />} />
      </Routes>
      <BottomNavBar />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
