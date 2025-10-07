import { config as loadEnv } from "dotenv";

loadEnv();

export const appConfig = {
  databaseUrl: process.env.AZURE_SQL_CONNECTION_STRING ?? "",
  jwtAudience: process.env.JWT_AUDIENCE ?? "",
  jwtIssuer: process.env.JWT_ISSUER ?? "",
  azureTenantId: process.env.AZURE_TENANT_ID ?? "",
  azureClientId: process.env.AZURE_CLIENT_ID ?? "",
  azureClientSecret: process.env.AZURE_CLIENT_SECRET ?? "",
  defaultYear: Number.parseInt(process.env.APP_DEFAULT_YEAR ?? "2025", 10),
};

if (!appConfig.jwtAudience || !appConfig.jwtIssuer) {
  console.warn("JWT configuration missing. API routes will reject authenticated requests until configured.");
}
