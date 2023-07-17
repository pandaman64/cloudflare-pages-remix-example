import {
  type AppLoadContext,
  createCookieSessionStorage,
} from "@remix-run/cloudflare";
import { getEnv } from "./env";

export function createSessionStorage(context: AppLoadContext) {
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [getEnv(context).SESSION_COOKIE_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });
}
