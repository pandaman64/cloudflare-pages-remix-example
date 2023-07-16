import { json, type V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  return json({ hello: "world" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Hello, {data.hello}!</h1>
    </main>
  );
}
