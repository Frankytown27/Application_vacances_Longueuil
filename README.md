# Application Vacances Longueuil

Solution de planification des vacances pour Microsoft Teams (onglet + API Azure Functions) destinée à la Direction du Développement urbain de Longueuil.

## Structure du dépôt

```
/README.md                Présent fichier
/.github/workflows        Pipelines CI/CD GitHub Actions
/apps/web                 Application front-end React + TypeScript (Vite)
/apps/api                 API Azure Functions (TypeScript) + Prisma
/config                   Paramètres annuels (minima, blackout, fériés)
/data                     Jeux de données et exemples d'import
/prisma                   Schéma et scripts Prisma (Azure SQL)
```

## Prérequis

- Node.js >= 20
- npm >= 9
- Azure Functions Core Tools (local)
- Base de données Azure SQL ou SQL Server locale pour le développement

## Mise en route rapide

```bash
npm install
npm run dev -w apps/api   # démarre l'API (nécessite func tools)
npm run dev -w apps/web   # démarre l'app front (Vite)
```

Voir `apps/web/README.md` et `apps/api/README.md` pour le détail des commandes, variables d'environnement et instructions de déploiement.

## Tests et qualité

```bash
npm run lint
npm run typecheck
npm run test
```

Les scripts utilisent Biome pour la qualité du code et Vitest/Jest pour les tests unitaires.

## Déploiement

- L'application front-end est conçue pour être déployée sur Azure Static Web Apps ou Azure App Service (Teams Tab).
- L'API Azure Functions peut être publiée via GitHub Actions (`.github/workflows/ci.yml`).
- Les secrets (chaînes de connexion, IDs AAD) sont gérés via Azure Key Vault / GitHub Secrets.

## Licence

© Ville de Longueuil — Projet interne.
