import { Form } from "@remix-run/react";
import { Button } from "./Button";

type Props = {
  name?: string;
};

export function Header({ name }: Props) {
  return (
    <header className="container mx-auto flex flex-row p-2">
      <div className="ml-auto">
        {name === undefined ? (
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
