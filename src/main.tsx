import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Mise à jour PWA : le service worker (registerType 'autoUpdate') installe la
 * nouvelle version en arrière-plan et la fait prendre le contrôle (skipWaiting +
 * clientsClaim). Mais la page déjà ouverte continue d'exécuter l'ANCIEN
 * JavaScript tant qu'elle n'est pas rechargée — d'où l'impression qu'un correctif
 * « ne marche pas » après un déploiement. On force donc un rechargement unique
 * dès que le nouveau service worker prend le contrôle.
 */
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    // Pas de rechargement lors de la toute première installation (aucune version
    // précédente à remplacer), uniquement lors d'une vraie mise à jour.
    if (!hadController) return
    refreshing = true
    window.location.reload()
  })
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
