import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNavBar } from './components/BottomNavBar'
import { BismillahScreen } from './components/BismillahScreen'
import { HomePage } from './pages/HomePage'
import { AlphabetPage } from './pages/AlphabetPage'
import { TajweedPage } from './pages/TajweedPage'
import { HifzPage } from './pages/HifzPage'
import { SurahStudyPage } from './pages/SurahStudyPage'
import { RevisionPage } from './pages/RevisionPage'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
