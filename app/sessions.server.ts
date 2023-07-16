import {
  type AppLoadContext,
  createCookieSessionStorage,
} from "@remix-run/cloudflare";

export function createSessionStorage(context: AppLoadContext) {
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: [(context.env as Record<string, string>).SESSION_COOKIE_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });
}
