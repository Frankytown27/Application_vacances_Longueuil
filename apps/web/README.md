# Front-end Teams — Application Vacances Longueuil

## Démarrage

```bash
npm install
npm run dev -w apps/web
```

L'application Vite est accessible sur `http://localhost:5173` et peut être intégrée comme onglet Teams via l'URL fournie.

## Structure

- `src/app/teams.ts` : initialisation SDK Microsoft Teams.
- `src/auth/azureAd.ts` : configuration MSAL/OIDC.
- `src/api/client.ts` : client HTTP Axios avec gestion du token.
- `src/state` : magasins Zustand et requêtes React Query.
- `src/pages` : pages principales (employé, admin, import).
- `src/components` : composants partagés (grilles, heatmap, calendrier).

## Tests

`npm run test -w apps/web`

Utilise Vitest + Testing Library.
