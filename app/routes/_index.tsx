import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { getAuthenticator } from "~/auth.server";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { getDb } from "~/db.server";
import { posts } from "~/schema";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cloudflare太郎" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  const drizzle = getDb(context);
  const myPosts =
    user !== null
      ? await drizzle
          .select()
          .from(posts)
          .where(eq(posts.userId, user.id))
          .all()
      : [];

  return json({ user, posts: myPosts });
}

export default function Index() {
  const { user, posts } = useLoaderData<typeof loader>();
  const postList =
    posts.length > 0 ? (
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/posts/${post.id}`}
              className="text-2xl underline underline-offset-4 hover:text-blue-500"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-lg">投稿がありません</p>
    );

  return (
    <>
      <Header user={user} />
      <main className="container mx-auto p-2">
        <h1 className="text-4xl">Hello, {user?.displayName}!</h1>
        {postList}
        <div className="flex flex-row">
          {user !== null ? (
            <div className="ml-auto">
              <Form action="/posts/new">
                <Button>新しい記事</Button>
              </Form>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
