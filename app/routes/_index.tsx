import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/auth.server";
import { Header } from "~/components/Header";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cloudflare太郎" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Header user={data.user} />
      <main className="container mx-auto p-2">
        <h1 className="text-4xl">Hello, {data.user?.displayName}!</h1>
      </main>
    </>
  );
}
