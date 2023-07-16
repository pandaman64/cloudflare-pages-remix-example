/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import {
  ReactNode,
  startTransition,
  StrictMode,
  useMemo,
  useState,
} from "react";
import { hydrateRoot } from "react-dom/client";
import ClientStyleContext from "./src/ClientStyleContext";
import createEmotionCache from "./src/createEmotionCache";
import { CssBaseline, CssVarsProvider, ThemeProvider } from "@mui/joy";

// https://github.com/mui/material-ui/blob/e6b4c22aac2e78cd5d4009d46ac3b0ec4b6cc26b/examples/material-remix-ts/app/entry.client.tsx
function ClientCacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState(createEmotionCache());

  const clientStyleContextValue = useMemo(
    () => ({
      reset() {
        setCache(createEmotionCache());
      },
    }),
    []
  );

  return (
    <ClientStyleContext.Provider value={clientStyleContextValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <CssVarsProvider>
          <CssBaseline />
          <RemixBrowser />
        </CssVarsProvider>
      </ClientCacheProvider>
    </StrictMode>
  );
});
