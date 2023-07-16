import { redirect, type ActionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/auth.server";

export function loader() {
  return redirect("/");
}

export function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
}
