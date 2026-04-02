# CESIZen Web

Interface d'administration du projet **CESIZen**, une application de gestion du stress et du bien-être mental destinée aux étudiants CESI.

Construite avec **React**, **TypeScript** et **Vite**.

> Accès réservé aux administrateurs. Les utilisateurs utilisent l'application mobile.

---

## Présentation du projet

CESIZen est composé de 3 projets :

| Projet | Description | Lien |
|--------|-------------|------|
| **cesizen-api** | Backend REST | [Repo](https://github.com/ItsMaxou1/cesizen-api) |
| **cesizen-web** (ce repo) | Interface admin (React) | - |
| **cesizen-mobile** | Application mobile (Expo) | [Repo](https://github.com/ItsMaxou1/cesizen-mobile) |

> L'API doit être lancée avant de démarrer ce projet.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm
- L'[API CESIZen](https://github.com/ItsMaxou1/cesizen-api) lancée sur le port 3001

## Installation

```bash
git clone https://github.com/ItsMaxou1/cesizen-web.git
cd cesizen-web
git checkout develop
npm install
```

## Lancer l'application

```bash
# Développement
npm run dev
```

L'application s'ouvre sur http://localhost:5173

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Configuration

L'URL de l'API est définie en dur dans les pages (`http://localhost:3001`).  
Si l'API tourne sur une autre adresse, modifier les appels `fetch` dans `src/pages/`.

## Connexion

L'accès est réservé aux comptes avec le rôle **ADMIN**.  
Créer un compte admin via l'API ou directement en base de données.

## Structure du projet

```
src/
├── components/         # Composants réutilisables
├── context/            # Contexte d'authentification (AuthContext)
├── pages/
│   ├── LoginPage.tsx         # Page de connexion
│   ├── DashboardPage.tsx     # Layout principal avec sidebar
│   ├── Sidebar.tsx           # Navigation latérale
│   ├── UtilisateursPage.tsx  # Gestion des utilisateurs
│   ├── ExercicesPage.tsx     # Gestion des exercices
│   ├── CategoriesPage.tsx    # Gestion des catégories
│   ├── ContenusPage.tsx      # Gestion des contenus informatifs
│   └── CommentairesPage.tsx  # Modération des commentaires
├── App.tsx             # Routes principales
└── main.tsx            # Point d'entrée
```

## Fonctionnalités

- Connexion sécurisée (JWT, rôle ADMIN requis)
- Gestion des utilisateurs : liste, activation/désactivation
- Gestion des exercices de respiration : création, modification, activation, suppression
- Gestion des catégories
- Gestion des contenus informatifs
- Modération des commentaires

## Dépannage

**Page blanche au démarrage :** vérifier que l'API est bien lancée sur le port 3001  
**Accès refusé à la connexion :** le compte doit avoir le rôle `ADMIN`  
**Erreur CORS :** vérifier que le `cors()` est activé dans l'API