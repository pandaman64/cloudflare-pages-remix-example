import { type ActionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/auth.server";

export async function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  await authenticator.logout(request, { redirectTo: "/" });
}
