import { type AppLoadContext } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { createSessionStorage } from "./sessions.server";
import { GoogleStrategy } from "remix-auth-google";
import { getEnv } from "./env";
import { getDb, loginOrRegister } from "./db.server";

export type User = {
  id: number;
  displayName: string;
};

let _authenticator: Authenticator<User> | undefined;
export function getAuthenticator(context: AppLoadContext): Authenticator<User> {
  if (_authenticator === undefined) {
    const env = getEnv(context);
    _authenticator = new Authenticator<User>(createSessionStorage(context));
    _authenticator.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async ({ profile }) => {
          const drizzle = getDb(context);
          return await loginOrRegister(
            drizzle,
            "google",
            profile.id,
            profile.displayName,
          );
        },
      ),
    );
  }
  return _authenticator;
}
