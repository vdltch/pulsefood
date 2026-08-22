# PULSE — Veggie. Protéiné. Vivant.

Application de recettes végétariennes protéinées avec studio éditorial sécurisé.

## Lancer le projet

```bash
cp .env.example .env
npm install
docker compose up -d db
npm run db:migrate
npm run db:seed
npm run dev
```

Ouvrir `http://localhost:3000`. Le studio est disponible sur le chemin privé défini par `STUDIO_PATH` ; `/admin` renvoie volontairement une erreur 404. L'API publique est sur `/api/recipes` et le diagnostic sur `/api/health`.

## Stack

- Next.js 16, React 19, TypeScript
- Prisma avec PostgreSQL 17
- Zod pour la validation de l'API
- Sessions signées HttpOnly et mots de passe hachés avec scrypt
- Sharp pour les images WebP
- CSS natif responsive, sans kit UI générique

## Base de données

```bash
npm run db:push
npm run db:seed
```

Le seed crée les recettes de démonstration et l'unique compte autorisé défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Change impérativement le mot de passe et `STUDIO_PATH` avant le premier démarrage public.

## Déploiement sur le VPS

1. Faire pointer les entrées DNS `A` de `pulsefood.fr` et `www` vers l'IP du VPS.
2. Installer Docker Engine et le plugin Compose.
3. Cloner le projet et créer `.env` depuis `.env.example`.
4. Générer les secrets : `openssl rand -base64 48` pour `AUTH_SECRET` et le mot de passe PostgreSQL.
5. Lancer `docker compose up -d --build`.

Caddy obtient et renouvelle automatiquement les certificats HTTPS. Au démarrage, le conteneur applicatif applique les migrations puis exécute le seed idempotent.

### Sauvegardes

Lancer `sh scripts/backup.sh`, idéalement chaque nuit via cron. Les dumps PostgreSQL sont conservés 14 jours. Le volume `uploads` doit également être sauvegardé par le fournisseur du VPS.

### Publication

- `DRAFT` : invisible sur le site public.
- `PUBLISHED` : visible immédiatement.
- `ARCHIVED` : conservé dans le studio, masqué du public.

Les images envoyées depuis le studio sont limitées à 8 Mo, redimensionnées à 1800×1200 maximum et converties en WebP.
