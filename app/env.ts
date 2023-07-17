import type { AppLoadContext } from "@remix-run/cloudflare";

export type Env = {
  // Environment variables
  SESSION_COOKIE_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  // Bindings
  DB: D1Database;
};

export function getEnv(context: AppLoadContext): Env {
  return context.env as Env;
}
