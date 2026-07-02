import * as React from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/router/router";

/**
 * Top-level route switch. The only public route is /login; everything else is
 * rendered inside the authenticated app shell behind the route guard.
 */
export default function App() {
  const { path, navigate } = useRouter();
  const { status } = useAuth();

  // Send authenticated users away from /login, and normalize the root path.
  React.useEffect(() => {
    if (path === "/login" && status === "authenticated") {
      navigate("/chat", { replace: true });
    } else if (path === "/" ) {
      navigate(status === "authenticated" ? "/chat" : "/login", {
        replace: true,
      });
    }
  }, [path, status, navigate]);

  if (path === "/login") {
    return <LoginForm />;
  }

  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  );
}
