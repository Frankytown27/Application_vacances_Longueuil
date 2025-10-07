import { app } from "@microsoft/teams-js";

let initialized = false;

export async function initTeams() {
  if (initialized) {
    return;
  }
  await app.initialize();
  const context = await app.getContext();
  if (context.app.host?.name === "teams") {
    await app.notifyAppLoaded();
    await app.notifySuccess();
  }
  initialized = true;
}
