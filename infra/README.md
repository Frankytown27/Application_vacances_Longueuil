# Infrastructure Azure (ébauche)

Ce dossier contient des exemples de déploiement Bicep pour l'application Vacances.

## Ressources déployées

- Azure SQL Database (S0)
- Azure Function App (plan consommation)
- Azure Storage Account (state Function + fichiers)
- Azure App Service / Static Web App pour le front
- Azure Bot Channel Registration (optionnel pour notifications Teams)

## Utilisation

1. Se connecter à Azure : `az login`
2. Définir le groupe de ressources : `az group create -n rg-vacances -l canadaeast`
3. Déployer :

```bash
az deployment group create \
  --resource-group rg-vacances \
  --template-file main.bicep \
  --parameters environment=dev sqlAdministratorLogin=sqladmin sqlAdministratorPassword=Pass@word1234!
```

## Secrets & configuration

Les identifiants Azure AD (client, secret, scope) doivent être configurés via Azure Key Vault et référencés dans Function App + Teams App.
