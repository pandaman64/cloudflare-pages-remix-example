import { type AppLoadContext } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { createSessionStorage } from "./sessions.server";
import { type GoogleProfile, GoogleStrategy } from "remix-auth-google";
import { getEnv } from "./env";

export type User = {
  profile: GoogleProfile;
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
          console.log(profile);
          return {
            profile,
          };
        },
      ),
    );
  }
  return _authenticator;
}
