import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  // TODO: disabled
};

export function Button({ children }: Props) {
  return (
    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
      {children}
    </button>
  );
}
