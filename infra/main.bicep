param environment string = 'dev'
param location string = resourceGroup().location
param sqlAdministratorLogin string
@secure()
param sqlAdministratorPassword string

var sqlServerName = 'sqlvacances${uniqueString(resourceGroup().id, environment)}'
var sqlDbName = 'vacances-${environment}'
var storageAccountName = 'stvacances${uniqueString(resourceGroup().id)}'
var functionAppName = 'func-vacances-${environment}'
var appServicePlanName = 'plan-vacances-${environment}'

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdministratorLogin
    administratorLoginPassword: sqlAdministratorPassword
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDbName
  location: location
  sku: {
    name: 'S0'
    tier: 'Standard'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
  }
}

resource plan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
}

resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storage.properties.primaryEndpoints.blob
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
      ]
    }
  }
}

output sqlConnectionString string = 'Server=tcp:${sqlServerName}.database.windows.net,1433;Initial Catalog=${sqlDbName};User ID=${sqlAdministratorLogin};Password=${sqlAdministratorPassword};Encrypt=true;'
