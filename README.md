# CESIZen Web

Interface d administration du projet CESIZen. Construite avec **React**, **TypeScript** et **Vite**.

> Réservé aux administrateurs. Les utilisateurs classiques utilisent l application mobile.

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm
- L [API CESIZen](https://github.com/ItsMaxou1/cesizen-api) doit être lancée

## Installation

```bash
# 1. Cloner le projet
git clone https://github.com/ItsMaxou1/cesizen-web.git
cd cesizen-web

# 2. Se mettre sur la branche develop
git checkout develop

# 3. Installer les dépendances
npm install
```

## Configuration

L URL de l API est définie directement dans les pages (`http://localhost:3001`).
Si l API tourne sur un autre port ou adresse, modifier les appels fetch dans `src/pages/`.

## Lancer l application

```bash
# Mode développement
npm run dev
```

L application s ouvre sur `http://localhost:5173`.

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Connexion

L accès est réservé aux comptes avec le rôle **ADMIN**.
Se connecter avec un compte administrateur créé via l API.

## Structure du projet

```
src/
+-- components/     # Composants réutilisables
+-- context/        # Contexte d authentification (AuthContext)
+-- pages/          # Pages de l application
¦   +-- LoginPage.tsx
¦   +-- DashboardPage.tsx
¦   +-- UtilisateursPage.tsx
¦   +-- ExercicesPage.tsx
¦   +-- CategoriesPage.tsx
¦   +-- ContenusPage.tsx
¦   +-- CommentairesPage.tsx
¦   +-- Sidebar.tsx
+-- App.tsx         # Routes principales
+-- main.tsx        # Point d entrée
```

## Fonctionnalités

- Gestion des utilisateurs (activation/désactivation)
- Gestion des exercices de respiration (CRUD)
- Gestion des catégories
- Gestion des contenus informatifs
- Modération des commentaires
