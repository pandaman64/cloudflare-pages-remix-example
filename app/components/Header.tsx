import { Form } from "@remix-run/react";
import { Button } from "./Button";
import type { User } from "~/auth.server";

type Props = {
  user: User | null;
};

export function Header({ user }: Props) {
  return (
    <header className="container mx-auto flex flex-row p-2">
      <div className="ml-auto">
        {user === null ? (
          <Form action="/auth/google" method="post">
            <Button>Login with Google</Button>
          </Form>
        ) : (
          <Form action="/auth/logout" method="post">
            <Button>Logout</Button>
          </Form>
        )}
      </div>
    </header>
  );
}
