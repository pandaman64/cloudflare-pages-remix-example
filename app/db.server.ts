import { type AppLoadContext } from "@remix-run/cloudflare";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { getEnv } from "./env";
import { idAssociation, users } from "./schema";
import { and, eq } from "drizzle-orm";
import type { User } from "./auth.server";

export function getDb(context: AppLoadContext) {
  return drizzle(getEnv(context).DB, {
    logger: process.env.NODE_ENV !== "production",
  });
}

export async function loginOrRegister(
  drizzle: DrizzleD1Database,
  provider: string,
  providerId: string,
  displayName: string,
): Promise<User> {
  return await drizzle.transaction(
    async (tx) => {
      const existingAssociation: // workaround for drizze typing bug
      | {
            userId: number;
          }
        | undefined = await tx
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
        return await tx
          .select()
          .from(users)
          .where(eq(users.id, existingAssociation.userId))
          .get();
      }

      // create a new user
      const newUser: User = await tx
        .insert(users)
        .values({ displayName })
        .returning({ id: users.id, displayName: users.displayName })
        .get();
      await tx
        .insert(idAssociation)
        .values({
          provider,
          providerId,
          userId: newUser.id,
        })
        .run();
      return newUser;
    },
    {
      // DEFERRED because we expect that most of the time we get an existing association.
      behavior: "deferred",
    },
  );
}
