import * as React from "react";

/**
 * Minimal client-side router built on the History API.
 *
 * The project brief limits us to React + useState/useContext (no routing
 * library), so this provides just enough: a current path, `navigate`, and a
 * `<Link>` helper. It listens to `popstate` for back/forward support.
 */

interface RouterContextValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = React.createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = React.useState<string>(window.location.pathname);

  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = React.useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (to === window.location.pathname) return;
      if (options?.replace) {
        window.history.replaceState({}, "", to);
      } else {
        window.history.pushState({}, "", to);
      }
      setPath(to);
    },
    [],
  );

  const value = React.useMemo(() => ({ path, navigate }), [path, navigate]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within a RouterProvider");
  return ctx;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, onClick, children, ...props }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        // Allow modifier-clicks to open in a new tab.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
