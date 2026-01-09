import { StrictMode } from "react";
import "./index.css";

// $ React Router Dom
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppProvider from "./context/AppProvider.tsx";
import { AuthProvider } from "./auth/AuthContext";

// $ React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";

// $ Add the toast (now called sonner) to the application
import { Toaster } from "../src/components/ui/sonner.tsx";

import configureAmplify from "../aws/amplifyConfig.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // Data will not be considered stale for 1 hour
      refetchOnWindowFocus: false, // Prevent refetching when the window is focused
      refetchOnReconnect: false, // Prevent refetching when the connection is restored
      refetchOnMount: false, // Prevent refetching when a component mounts } },
    },
  },
});

configureAmplify();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppProvider>
            <Toaster position="top-center" richColors duration={1300} />
            <App />
          </AppProvider>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
