import { type AppLoadContext } from "@remix-run/cloudflare";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getEnv } from "./env";
import { idAssociation, users } from "./schema";
import { and, eq } from "drizzle-orm";
import type { User } from "./auth.server";

export function getDb(context: AppLoadContext) {
  return drizzle(getEnv(context).DB, {
    logger: true,
  });
}

export async function loginOrRegister(
  drizzle: DrizzleD1Database,
  provider: string,
  providerId: string,
  displayName: string,
): Promise<User> {
  // It's unfortunate that D1 doesn't offer a flexible transaction API.
  // Since this is just an toy app, we don't care about transaction.
  const existingAssociation: // workaround for drizze typing bug
  | {
        userId: number;
      }
    | undefined = await drizzle
    .select()
    .from(idAssociation)
    .where(
      and(
        eq(idAssociation.provider, provider),
        eq(idAssociation.providerId, providerId),
      ),
    )
    .get();
  if (existingAssociation !== undefined) {
    return await drizzle
      .select()
      .from(users)
      .where(eq(users.id, existingAssociation.userId))
      .get();
  }
  // create a new user
  const newUser: User = await drizzle
    .insert(users)
    .values({ displayName })
    .returning({ id: users.id, displayName: users.displayName })
    .get();
  await drizzle
    .insert(idAssociation)
    .values({
      provider,
      providerId,
      userId: newUser.id,
    })
    .run();
  return newUser;
}
