import type { ActionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import type { InferModel } from "drizzle-orm";
import { and, eq } from "drizzle-orm";
import { getAuthenticator } from "~/auth.server";
import { getDb } from "~/db.server";
import { posts } from "~/schema";

export async function loader({ request, context, params }: ActionArgs) {
  const user = await getAuthenticator(context).isAuthenticated(request);
  if (user === null) {
    return redirect("/");
  }

  const drizzle = getDb(context);
  const id = Number(params["id"]);
  const post = await drizzle
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
    .get();
  return json<{ id: Number; post: InferModel<typeof posts> | undefined }>({
    id,
    post,
  });
}

export default function Post() {
  const { id, post } = useLoaderData<typeof loader>();
  return post !== undefined ? (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 p-2">
      <h1 className="text-4xl">{post.title}</h1>
      <div className="border-2" />
      <p className="text-lg">{post.body}</p>
      <Link className="text-md mt-auto hover:text-blue-500" to="/">
        トップに戻る
      </Link>
    </div>
  ) : (
    <div className="container mx-auto flex min-h-screen flex-col gap-4 p-2">
      <h1 className="text-4xl">Not Found: {id.toString()}</h1>
      <Link className="text-md mt-auto hover:text-blue-500" to="/">
        トップに戻る
      </Link>
    </div>
  );
}
