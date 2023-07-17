import {
  json,
  type ActionArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "~/auth.server";
import { Header } from "~/components/Header";
import { getDb } from "~/db.server";
import { idAssociation } from "~/schema";

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
  const assocs = await drizzle.select().from(idAssociation).all();

  return json({ name: user?.profile?.displayName, assocs });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Header name={data.name} />
      <main className="container mx-auto p-2">
        <h1 className="text-4xl">Hello, {data.name}!</h1>
        <ul>
          {data.assocs.map((assoc) => (
            <li key={`${assoc.provider}-${assoc.providerId}`}>
              {assoc.provider}, {assoc.providerId}, {assoc.userId}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
