import type { ActionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { redirect } from "react-router";
import { getAuthenticator } from "~/auth.server";
import { Button } from "~/components/Button";
import { getDb } from "~/db.server";
import { posts } from "~/schema";

export async function action({ request, context }: ActionArgs) {
  const user = await getAuthenticator(context).isAuthenticated(request);
  if (user === null) {
    return redirect("/");
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  const drizzle = getDb(context);
  const { id } = await drizzle
    .insert(posts)
    .values({
      userId: user.id,
      title,
      body,
    })
    .returning({ id: posts.id })
    .get();

  return redirect(`/posts/${id}`);
}

export default function NewPost() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      <h1 className="text-4xl">New Post</h1>
      <Form className="flex flex-grow flex-col gap-4 p-4" method="post">
        <label htmlFor="title" className="text-xl">
          Title
        </label>
        <textarea id="title" name="title" className="border-2" />

        <label htmlFor="body" className="text-xl">
          Body
        </label>
        <textarea id="body" name="body" className="flex-grow border-2" />

        <div className="flex flex-row">
          <div className="ml-auto">
            <Button>投稿</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
