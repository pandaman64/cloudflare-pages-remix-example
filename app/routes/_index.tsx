import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/auth.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);
  return json({ name: user?.profile?.displayName });
}

export async function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  await authenticator.logout(request, { redirectTo: "/" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Hello, {data.name}!</h1>
      <Form action="/auth/google" method="post">
        <button>Login with Google</button>
      </Form>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </main>
  );
}
