# PULSE — Veggie. Protéiné. Vivant.

Application web/PWA de recettes végétariennes protéinées avec studio éditorial intégré.

## Lancer le projet

```bash
cp .env.example .env
npm install
npm run dev
```

Ouvrir `http://localhost:3000`. Le back-office est disponible sur `/admin` et l'API sur `/api/recipes`.

## Stack

- Next.js 15, React 19, TypeScript
- Prisma avec SQLite en local (remplacer le provider par PostgreSQL en production)
- Zod pour la validation de l'API
- CSS natif responsive, sans kit UI générique

## Base de données

```bash
npm run db:push
npm run db:seed
```

Le front utilise pour l'instant les données de démonstration de `lib/recipes.ts` afin de fonctionner immédiatement. Le schéma Prisma et les routes API posent la base du raccordement persistant.
