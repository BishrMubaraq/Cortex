import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { RouterProvider } from "@/router/router";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200} skipDelayDuration={0}>
            <App />
          </TooltipProvider>
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  </StrictMode>,
);
