import type { Context, HttpRequest } from "@azure/functions";
import type { AuthContext } from "../types/auth";

export function requireAuth(req: HttpRequest, context: Context): AuthContext {
  const upn = req.headers.get("x-ms-client-principal-name") ?? "";
  const rolesHeader = req.headers.get("x-ms-client-roles") ?? "";

  if (!upn) {
    context.log.warn("Missing UPN header (x-ms-client-principal-name)");
    throw new Error("AUTH_REQUIRED");
  }

  const roles = rolesHeader
    .split(",")
    .map((role) => role.trim())
    .filter((role): role is AuthContext["roles"][number] => Boolean(role));

  return {
    upn,
    roles: roles.length > 0 ? roles : ["employe"],
  };
}
