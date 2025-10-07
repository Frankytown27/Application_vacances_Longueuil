import { PublicClientApplication } from "@azure/msal-browser";

type AuthResult = string | null;

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_TEAMS_APP_ID ?? "00000000-0000-0000-0000-000000000000",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT ?? "common"}`,
    redirectUri: import.meta.env.VITE_APP_BASE_URL ?? window.location.origin,
  },
});

export async function acquireToken(): Promise<AuthResult> {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (!accounts.length) {
      return null;
    }
    const result = await msalInstance.acquireTokenSilent({
      account: accounts[0],
      scopes: [import.meta.env.VITE_API_SCOPE ?? "api://vacations/.default"],
    });
    return result.accessToken;
  } catch (error) {
    console.warn("Token acquisition failed", error);
    return null;
  }
}

export async function initializeAuth() {
  await msalInstance.initialize();
  if (!msalInstance.getAllAccounts().length) {
    try {
      await msalInstance.ssoSilent({ loginHint: "" });
    } catch (error) {
      console.warn("SSO silent failed", error);
    }
  }
}
