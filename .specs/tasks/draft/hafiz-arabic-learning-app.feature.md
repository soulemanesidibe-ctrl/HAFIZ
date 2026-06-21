---
title: Hafiz - Application PWA d'apprentissage de l'arabe coranique et mémorisation du Coran
type: feature
status: draft
---

## Description

Créer une application web Progressive Web App (PWA) mobile-first complète pour permettre à un débutant complet d'apprendre l'alphabet arabe coranique et de mémoriser le Coran (Hifz), en suivant les méthodes recommandées par les savants islamiques.

**Contexte utilisateur :** Débutant complet (aucune connaissance de l'arabe), objectif principal = mémoriser le Coran. Les savants recommandent : apprendre l'alphabet d'abord → Tajweed de base → commencer par Juz Amma → répétition intensive (20-40x par verset) → Murajaah (80% révision, 20% nouveau) → comprendre le sens aide la mémorisation.

## Stack Technique

- **Frontend :** React 18 + Vite + TypeScript
- **Styling :** Tailwind CSS v3
- **PWA :** Vite PWA Plugin (Workbox) + Web App Manifest
- **State :** Zustand (état global) + localStorage (persistance)
- **API :** Quran.com API v4 (gratuite, texte + audio authentiques)
- **Police arabe :** Amiri (Google Fonts) - police classique pour l'arabe coranique
- **Hébergement :** Vercel (free tier, deploy via GitHub Actions)
- **Tests :** Vitest + Testing Library

## Fonctionnalités Requises

### 1. Module Alphabet (الحروف)
- 28 lettres arabes avec 4 formes chacune (isolée, initiale, médiane, finale)
- Prononciation phonétique fidèle (translittération académique, pas approximative)
- Audio de prononciation pour chaque lettre
- Exercices de reconnaissance (quiz visuels)
- Progression tracking par lettre

### 2. Module Tajweed de Base (التجويد)
- Règles fondamentales : Madd (allongement), Sukun (repos), Shadda (redoublement), Tanwin (nunation), Nun Sakin/Tanwin (Idgham, Ikhfa, Iqlab, Idhar)
- Exemples visuels avec mise en évidence dans des versets réels
- Explications en français
- Audio démonstratif

### 3. Module Hifz - Mémorisation (الحفظ)
- Parcours structuré : Juz Amma (Sourate 114 → Sourate 78)
- Verset par verset avec :
  - Texte arabe authentique (via Quran.com API, Mushaf Uthmani)
  - Audio récitateur (Sheikh Mishary Alafasy ou équivalent)
  - Traduction française (Mohammed Hamidullah)
  - Translittération fidèle
  - Compteur de répétitions (objectif: 20-40 répétitions)
  - Mode écoute, mode récitation, mode mémorisation
- Progression par sourate et par verset

### 4. Système de Révision Espacée (المراجعة)
- Algorithme SM-2 adapté (type Anki) pour les versets mémorisés
- Rappel quotidien des versets à réviser
- Statistiques de rétention
- 80% révision / 20% nouveau contenu

### 5. Progression & Dashboard
- Tableau de bord avec progression globale
- Statistiques quotidiennes (versets mémorisés, temps d'étude)
- Sauvegarde locale (localStorage)
- Pas de compte requis (privacy-first)

### 6. PWA Features
- Installable sur téléphone (Add to Home Screen)
- Fonctionnement hors ligne (service worker, cache Quran data)
- Notifications de rappel quotidien
- Icônes et splash screen

## Règles Islamiques Obligatoires

- **Texte coranique authentique uniquement** - via Quran.com API officielle, Mushaf Uthmani
- **Audio coranique uniquement** - aucune musique de fond, uniquement récitation
- **Respect de la sacralité** - pas de gamification excessive (pas de points, pas de badges, pas de streaks de jeu vidéo)
- **Bismillah au démarrage** - chaque session commence avec Bismillah
- **Dua d'ouverture** - invocation avant chaque session de mémorisation (دعاء الحفظ)
- **Translittération fidèle** - système académique (ALA-LC ou similaire), pas de phonétique approximative
- **Direction RTL** - texte arabe correctement affiché de droite à gauche
- **Wudu reminder** - rappel optionnel de se purifier avant de toucher/mémoriser le Coran

## UI/UX

- **Thème :** Sombre élégant (fond très sombre #0F1419, texte clair, accents dorés #C9A84C)
- **Police arabe :** Amiri (serif classique, parfaite pour le Coran)
- **Police UI :** Inter (clair, lisible)
- **Navigation :** Bottom navigation bar sur mobile (4 onglets : Accueil, Alphabet, Tajweed, Hifz)
- **Animations :** Légères et non-distrayantes (fadeIn, transitions douces)
- **Responsive :** Mobile-first, adapté aussi pour desktop
- **Accessibilité :** ARIA labels, contrast suffisant

## Hébergement Gratuit

- **Vercel** : deploy automatique via push sur GitHub (free tier illimité pour projets personnels)
- **GitHub** : repository public ou privé
- **Domaine** : sous-domaine Vercel gratuit (hafiz-app.vercel.app)

## Acceptance Criteria

1. L'application s'installe comme une PWA sur un téléphone Android/iOS
2. L'alphabet arabe complet (28 lettres × 4 formes) est affiché correctement en RTL
3. Le texte coranique affiché correspond exactement à l'API Quran.com (Mushaf Uthmani)
4. L'audio se lit sans musique de fond
5. La progression est sauvegardée après fermeture et réouverture
6. L'application fonctionne hors ligne (data mise en cache)
7. Les règles islamiques (Bismillah, dua, respect) sont présentes
8. Le score Lighthouse PWA ≥ 90
9. Déployé sur Vercel, accessible via URL publique
