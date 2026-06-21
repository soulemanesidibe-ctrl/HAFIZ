# حافظ — Hafiz

Application web PWA pour **apprendre l'arabe coranique** et **mémoriser le Coran (Hifz)**, conçue pour un débutant complet, selon les méthodes recommandées par les savants.

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

## Fonctionnalités

- **Alphabet** — les 28 lettres arabes (formes isolée/initiale/médiane/finale), translittération académique (ALA-LC), groupes solaires/lunaires, quiz de reconnaissance.
- **Tajweed** — règles fondamentales (Madd, Sukun, Shadda, Tanwin, règles du Nun sakin, Qalqala) avec exemples.
- **Hifz** — mémorisation du Juz 'Amma (sourates 114 → 78), verset par verset, avec :
  - texte arabe authentique (Mushaf Uthmani, API Al-Quran Cloud),
  - audio de récitation (Sheikh Mishary Rashid Al-Afasy),
  - traduction française (Hamidullah),
  - compteur de répétitions (objectif 20, selon les savants),
  - 3 modes : Écoute, Mémorisation, Révision,
  - dua obligatoire avant chaque session.
- **Révision espacée** — algorithme SM-2 (type Anki), file quotidienne, 80 % révision / 20 % nouveau.
- **PWA** — installable sur téléphone, fonctionne hors ligne (texte et audio mis en cache).

## Règles islamiques respectées

- Texte coranique authentique uniquement (API officielle, Mushaf Uthmani)
- Audio : récitation coranique uniquement, jamais de musique
- Bismillah au démarrage, dua avant chaque session
- Translittération académique fidèle
- Sobriété : pas de gamification de jeu vidéo

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS · Zustand · vite-plugin-pwa · API [Al-Quran Cloud](https://alquran.cloud/api) (gratuite) · audio [islamic.network](https://islamic.network) (gratuit).

## Développement

```bash
npm install
npm run dev      # serveur local
npm run build    # build de production
npm run preview  # prévisualiser le build
```

## Déploiement gratuit sur Vercel (0 €)

1. Crée un dépôt sur [github.com](https://github.com) (ex. `hafiz-app`) et pousse le code :
   ```bash
   git remote add origin https://github.com/<ton-pseudo>/hafiz-app.git
   git branch -M main
   git push -u origin main
   ```
2. Va sur [vercel.com](https://vercel.com), connecte-toi avec GitHub.
3. **Add New… → Project → Import** le dépôt `hafiz-app`.
4. Vercel détecte Vite automatiquement (`vercel.json` est déjà configuré). Clique **Deploy**.
5. Après ~1 minute, l'app est en ligne sur `https://hafiz-app-xxxx.vercel.app`.
6. Sur ton téléphone, ouvre l'URL → menu navigateur → **Ajouter à l'écran d'accueil** pour l'installer comme une vraie app.

Chaque `git push` redéploie automatiquement. Le free tier Vercel est gratuit et illimité pour un projet personnel.

وَقُل رَّبِّ زِدْنِي عِلْمًا — « Ô mon Seigneur, accroît mes connaissances » (Sourate Ta-Ha, 20:114)
