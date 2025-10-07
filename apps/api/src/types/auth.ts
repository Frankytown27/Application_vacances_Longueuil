export type AppRole = "employe" | "gestionnaire" | "admin";

export interface AuthContext {
  upn: string;
  roles: AppRole[];
}
