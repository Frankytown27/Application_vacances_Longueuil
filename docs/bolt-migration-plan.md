# Plan de migration vers Bolt Database et application web standard

Ce document décrit les étapes nécessaires pour migrer l'application de sa pile Azure SQL / Azure AD / Azure Functions vers une architecture web standard utilisant Bolt Database (PostgreSQL) et une API Express.

## 1. Base de données (Bolt Database / PostgreSQL)

1. Exporter le schéma Prisma actuel (SQL Server) et créer une branche de migration.
2. Mettre à jour `prisma/schema.prisma` :
   - Remplacer le provider `sqlserver` par `postgresql`.
   - Adapter les types (`Decimal`, `DateTime`, `Boolean`, `Json`) et les attributs (`@default`, `@db.Numeric`, etc.).
   - Vérifier les relations et les index pour la compatibilité PostgreSQL.
3. Mettre à jour `prisma/migrations` en générant une nouvelle migration ciblant Bolt Database.
4. Configurer `DATABASE_URL` dans `.env` pour la connexion Bolt Database.
5. Générer le nouveau client Prisma (`npm run prisma:generate`).
6. Valider la connexion en exécutant `npx prisma migrate deploy` sur un environnement Bolt Database de test.

## 2. Authentification (Bolt Auth)

1. Supprimer les dépendances Azure AD / MSAL (`@azure/msal-browser`, `@azure/msal-react`).
2. Ajouter le SDK Bolt Auth (par ex. `@bolt/auth-js`) côté front et back.
3. Créer un service d'authentification côté API qui gère :
   - L'inscription (email + mot de passe) avec stockage hashé dans la base PostgreSQL.
   - La connexion et la création de sessions (JWT signés par Bolt Auth ou sessions Prisma).
   - La gestion des rôles (admin, manager, employe) via une table de rôles liée aux utilisateurs.
4. Mettre à jour le middleware d'authentification API pour valider les sessions Bolt Auth.
5. Modifier les hooks React (`useCurrentUser`) et le contexte d'authentification pour consommer les sessions Bolt.
6. Remplacer toute utilisation d'UPN par l'email utilisateur.

## 3. API (Express ou Fastify)

1. Créer un nouveau serveur API dans `apps/api` basé sur Express ou Fastify.
2. Mapper les Azure Functions existantes vers des routes HTTP classiques :
   - `GET /api/me`
   - `GET/POST /api/requests`
   - `GET/POST /api/settings`
   - `GET/POST /api/holidays`
   - `GET /api/weeks`
3. Adapter les services (`profileService`, `timeOffService`, etc.) pour utiliser les routes Express et le client Prisma PostgreSQL.
4. Mettre à jour la logique d'erreur (statuts HTTP) pour remplacer le contexte Functions par Express.
5. Ajouter des tests d'intégration (Vitest ou Jest) pour les nouvelles routes.

## 4. Frontend (React + Vite)

1. Nettoyer les initialisations spécifiques à Teams/Azure dans `apps/web`.
2. Créer des pages de connexion / inscription standard consommant l'API Bolt Auth.
3. Mettre à jour le client API (probablement `apps/web/src/lib/api.ts`) pour pointer vers la nouvelle API Express.
4. Adapter les composants de layout pour enlever les dépendances Teams (fluent UI, theme Teams) si nécessaire.
5. Vérifier la configuration Vite pour un déploiement web classique (environnement `BASE_URL`, proxies dev).
6. Ajouter des tests UI (Vitest + React Testing Library) couvrant les nouveaux flux d'authentification.

## 5. Variables d'environnement

1. Créer `.env.example` avec :
   - `DATABASE_URL`
   - `BOLT_DATABASE_URL`
   - `BOLT_DATABASE_ANON_KEY`
   - `BOLT_AUTH_JWT_SECRET`
2. Supprimer les variables Azure (ex. `AZURE_SQL_CONNECTION_STRING`, `JWT_AUDIENCE`, `AZURE_AD_CLIENT_ID`).
3. Mettre à jour `config.ts` et toute référence aux anciennes variables.
4. Documenter dans le README la nouvelle configuration (scripts, environnements).

## 6. Tests et validation

1. Lancer `npm run lint`, `npm run typecheck`, `npm run test` pour vérifier la qualité.
2. Écrire des tests d'intégration pour les scénarios critiques (création de demande, approbation, export).
3. Effectuer des tests manuels :
   - Connexion / déconnexion / inscription.
   - Gestion des rôles et permissions.
   - CRUD employés, demandes, rondes, validations.
   - Export/import de données.
4. Préparer un plan de déploiement (environnements staging et prod) et un rollback plan.

## Prochaines étapes

- Valider la faisabilité avec l'équipe (choix du framework API, contraintes Bolt Database).
- Évaluer l'effort de migration et découper en lots de travail.
- Mettre en place un environnement de test Bolt Database.
- Démarrer la migration par la base de données et l'API avant d'adapter le front.

