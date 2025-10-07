# API Azure Functions — Application Vacances Longueuil

## Scripts npm

- `npm run dev` : démarre les Azure Functions en mode local (`func start`).
- `npm run build` : compile TypeScript vers `dist/`.
- `npm run test` : exécute les tests Vitest.
- `npm run typecheck` : vérifie les types sans émettre de JS.

## Variables d'environnement

Créer un fichier `.env` (ou utiliser les Variables Application Settings Azure) avec :

```
AZURE_SQL_CONNECTION_STRING=
JWT_AUDIENCE=
JWT_ISSUER=
AZURE_CLIENT_ID=
AZURE_TENANT_ID=
AZURE_CLIENT_SECRET=
```

## Organisation

- `src/functions` : endpoints HTTP (GET /me, POST /requests...).
- `src/services` : logique métier (validation soldes, calcul minima).
- `src/utils` : utilitaires communs (dates, découpage par semaine, auth).
- `src/schemas` : validations Zod pour les payloads API.
- `prisma` : schéma de BD et scripts `seed`.

## Déploiement

Publier via `func azure functionapp publish <app_name>` ou GitHub Actions. Les migrations Prisma doivent être exécutées avant la première mise en production (`npx prisma migrate deploy`).
