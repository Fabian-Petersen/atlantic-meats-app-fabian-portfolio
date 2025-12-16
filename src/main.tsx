import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProvider from "./useGlobalContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
