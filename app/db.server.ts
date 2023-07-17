import { type AppLoadContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { getEnv } from "./env";

export function getDb(context: AppLoadContext) {
  return drizzle(getEnv(context).DB, { logger: true });
}
