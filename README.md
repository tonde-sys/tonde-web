# TONDE Web

Landing page officielle **et cockpit d’administration** de **TONDE**, l’infrastructure intelligente de gestion de files d’attente conçue pour les institutions africaines modernes.

## Objectif

Cette application sert de **vitrine produit** et de **cockpit de démonstration** pour présenter :

- la proposition de valeur TONDE
- les problèmes terrain adressés
- l’écosystème produit TONDE (mobile, guichet, écran de salle, dashboard)
- les garanties techniques (temps réel, offline-first, cloisonnement RLS)
- les cadres commerciaux et la FAQ direction
- le pilotage opérationnel : affluence, alertes, files par guichet, carte des agences

## Statut du projet

- **Landing page éditoriale** : oui
- **Cockpit admin (dashboard, files, agents)** : refondu, données de démonstration
- **Pages secondaires (agences, statistiques, paramètres)** : placeholders explicites
- **Applications métier réelles** : en développement
- **Visuels produits** : maquettes conceptuelles remplaçables
- **Backend connecté** : non

## Direction artistique — Fintech minimaliste

Interface **hybride** : surfaces claires pour le travail, panneaux sombres pour les moments forts
(hero, connexion, maquettes produits).

- Canvas `#F7F8FA`, cartes blanches, filets `#E5E8EF`, encre `#0B0F17`
- Panneaux sombres `#0A0E1A`
- Accent primaire **violet `#6C47FF`**, accent secondaire **cyan `#00D4FF`**
- Sémantique : succès `#10B981`, alerte `#F43F5E`, attention `#F59E0B`
- Typographie **Inter** partout, titres en 700 avec interlettrage serré (`-0.03em` à `-0.042em`)
- Aucune texture, aucun empattement : surfaces nettes, bordures d'un pixel
- Une seule signature de mouvement : courbe `[0.16, 1, 0.3, 1]`, révélations 0,65–0,9 s
- Deux jeux de classes : éditorial (`.display-*`, `.kicker`, `.btn`) et applicatif
  (`.app-surface`, `.app-table`, `.app-badge`, `.app-num`) — plus aucun style inline dans les pages

## Stack technique

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (`@theme`, tokens `brand-*`)
- **Framer Motion 14**
- **Lucide React**
- shadcn/ui + Radix (conservés pour le dashboard)

## Structure principale

```text
app/
  globals.css              ← tokens éditoriaux + classes (hero-title, kicker, btn, app-*…)
  layout.tsx               ← Inter + Manrope, MotionConfig reducedMotion="user"
  page.tsx                 ← composition de la landing
  (auth)/login/page.tsx    ← connexion scindée : formulaire clair + panneau récit sombre
  (dashboard)/
    layout.tsx             ← sidebar sombre, header clair, sélecteurs agence/langue, ⌘K
    dashboard/page.tsx     ← KPI, affluence (Recharts), alertes, file active, carte OSM
    queue/page.tsx         ← files par guichet, badge de statut, modale de transfert
    agents/page.tsx        ← tableau agents, filtres, bascules d’activation
    {locations,analytics,settings}/page.tsx ← PagePlaceholder (périmètre annoncé)

components/
  landing/
    navigation.tsx         ← barre flottante, pill layoutId, menu mobile role="dialog"
    hero-section.tsx       ← carousel 3 scènes, clipPath, Ken Burns, clavier
    proof-marquee.tsx      ← bandeau de garanties techniques
    manifesto-section.tsx  ← chapitre 01 · problème + 22 %
    proof-scene.tsx        ← chapitre 02 · parallaxe + parcours en 3 étapes
    ecosystem-section.tsx  ← chapitre 03 · scroll horizontal desktop / grille mobile
    voices-section.tsx     ← chapitre 04 · signaux terrain (scène sombre)
    pricing-section.tsx    ← chapitre 05 · onglets accessibles
    faq-section.tsx        ← chapitre 06 · accordéon
    cta-section.tsx        ← chapitre 07 · CTA + newsletter (états complets)
    footer-section.tsx     ← footer substantiel + retour en haut
    scroll-progress.tsx    ← barre de progression de lecture
  app/
    page-placeholder.tsx   ← placeholder éditorial partagé (module + périmètre)
  ui/                      ← shadcn/ui (disponible, très peu utilisé)
  motion-provider.tsx      ← MotionConfig global

lib/
  motion.tsx               ← EASE, variants, Reveal, MaskedTitle, AnimatedNumber
  landing-demo.ts

public/assets/editorial/   ← 5 scènes documentaires WebP (hero, preuve, portrait)
public/assets/mockups/     ← maquettes SVG des 4 interfaces
```

## Parcours de la landing

1. Hero cinématique — 3 scènes (salle d’attente, guichet, parcours usager)
2. Bandeau de garanties — temps réel, offline-first, RLS, 4 interfaces
3. Chapitre 01 — le problème, chiffre 22 %, quatre impacts
4. Chapitre 02 — scène de preuve en parallaxe + parcours en trois étapes
5. Chapitre 03 — les quatre interfaces (scroll horizontal desktop)
6. Chapitre 04 — signaux terrain, citation et portrait
7. Chapitre 05 — trois cadres commerciaux en onglets
8. Chapitre 06 — FAQ direction
9. Chapitre 07 — CTA final + newsletter
10. Footer — navigation, contact, retour en haut

## Cockpit d’administration

Le cockpit reprend le même langage que la landing, en version dense et lisible :

- **Coque** : sidebar sombre `#0A0E1A` (248 px), pilule active cyan `#00D4FF`, header clair
- **Aperçu** : cartes KPI, courbe d’affluence (Recharts, palette de marque), panneau
  d’alertes, file active et carte des agences
- **Files d’attente** : cartes par guichet avec liseré d’état, badges de statut,
  modale de transfert (`role="dialog"`, `aria-modal`)
- **Agents** : tableau dense, filtres par rôle et par statut, bascules d’activation
- **Chiffres** : `.app-num` en `tabular-nums` pour que les colonnes restent alignées
- **Carte** : tuiles OpenStreetMap en niveaux de gris, `fitBounds`
  sur les cinq sites, molette rendue à la page

Toutes les données sont des **données de démonstration**, signalées comme telles
dans la sidebar.

## Visuels

Les scènes documentaires sont générées puis converties en WebP (`sharp`, qualité 82) :

| Fichier | Usage |
|---|---|
| `hero-agence.webp` | Scène 1 du hero |
| `hero-guichet.webp` | Scène 2 du hero |
| `hero-hopital.webp` | Scène 3 du hero |
| `preuve-mobile.webp` | Scène de preuve (parallaxe) |
| `voix-agent.webp` | Section signaux terrain |

Poids total : environ 640 Ko pour cinq scènes. Les maquettes SVG des interfaces restent des visuels conceptuels remplaçables par de vraies captures.

## Accessibilité et mouvement

- `MotionConfig reducedMotion="user"` et `useReducedMotion()` sur chaque scène animée
- Écosystème en grille 2×2 (aucun scroll horizontal) (aucun contenu bloqué)
- Carousel : pause, pause au focus, flèches, clavier ←/→, onglets avec progression, `aria-live`
- Menu mobile : `role="dialog"`, `aria-modal`, fermeture Échap, focus initial, blocage du scroll
- Tarifs et FAQ : `role="tab"`/`aria-selected`, `aria-expanded`/`aria-controls`
- Formulaire : label associé, consentement explicite, `role="status"`, état d’erreur
- Aucun texte définitivement invisible sans JavaScript

## Lancer le projet en local

```bash
npm install
```

Sur cet environnement Windows, Turbopack pose problème. Utiliser **Webpack** :

```bash
npx next dev --webpack
```

Puis ouvrir `http://localhost:3000`.

### Build production

```bash
npm run build
npm run start
```

## Scripts disponibles

```bash
npm run build        # next build --webpack
npm run build:turbo  # next build
npm run dev
npm run start
```

## Validation réalisée

- `npm run build` ✅ (10 routes statiques générées)
- `npx tsc --noEmit` ✅ (aucune erreur)
- Audit navigateur Chrome ✅ : 8 routes × 390 / 768 / 1440 px = 24 combinaisons
  - toutes en HTTP 200, aucune erreur console
  - aucun débordement horizontal (`scrollWidth === innerWidth`)
- Interactions vérifiées : carousel (clic + clavier), onglets tarifs, accordéon FAQ,
  menu mobile (Échap, scroll bloqué), formulaire newsletter (erreur puis succès)
- Reduced motion : grille statique de 4 cartes écosystème, pas de piste 300 vh, contenu intégral
- Carte des agences : 6/6 tuiles OpenStreetMap chargées, attribution présente,
  cadrage automatique sur les 5 sites (`fitBounds`), molette qui fait défiler la page
  au lieu de zoomer la carte

## Prochaines étapes

1. Couche API réelle : client HTTP, authentification, `middleware.ts` de protection des routes.
2. Centralisation des mocks et des types partagés entre landing et dashboard.
3. Nettoyage : composants `ui/*` inutilisés, `styles/globals.css` orphelin, configuration ESLint absente.
4. Remplacer les maquettes SVG par de vraies captures d’écran des applications Flutter.

## Notes

- Le mode clair est désormais le mode principal ; les scènes sombres sont intentionnelles.
- Le formulaire newsletter valide la saisie mais n’envoie encore aucune donnée à un serveur.
- La connexion n’authentifie personne : elle redirige vers `/dashboard` après 1,2 s.
  Le bandeau « Version pilote — données de démonstration » le rappelle dans le cockpit.
- Les pages Agences, Statistiques et Paramètres annoncent leur périmètre prévu
  plutôt que d’afficher un faux contenu.

## Dépôt GitHub

```text
https://github.com/TONDE-APP/tonde-web.git
```
