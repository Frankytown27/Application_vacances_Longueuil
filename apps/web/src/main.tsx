import "@fluentui/react-components/dist/fluentui.css";

import { FluentProvider, Theme, teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { useTheme } from "./state/themeStore";

const queryClient = new QueryClient();

const Root = () => {
  const mode = useTheme((state) => state.mode);
  const theme = useMemo<Theme>(() => (mode === "dark" ? teamsDarkTheme : teamsLightTheme), [mode]);

  return (
    <FluentProvider theme={theme} style={{ minHeight: "100vh" }}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </FluentProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
