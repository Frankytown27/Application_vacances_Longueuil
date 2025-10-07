import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({ path: path.join(__dirname, "../../.env") });

export const appConfig = {
  supabaseUrl: process.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  defaultYear: Number.parseInt(process.env.APP_DEFAULT_YEAR ?? "2025", 10),
  port: Number.parseInt(process.env.PORT ?? "3001", 10),
};

if (!appConfig.supabaseUrl || !appConfig.supabaseAnonKey) {
  console.warn("Supabase configuration missing. API authentication will not work.");
}
