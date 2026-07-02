import * as React from "react";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/router/router";

/**
 * Route guard. Renders children only when authenticated. While the auth state
 * is resolving it shows a minimal loader; if unauthenticated it redirects to
 * /login.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const { navigate } = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login", { replace: true });
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return <>{children}</>;
}
