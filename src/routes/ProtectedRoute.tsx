import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../lib/roleHome";

interface Props {
  // Role-home path this page belongs to; omit for any authenticated user (e.g. Settings).
  path?: string;
  children: ReactNode;
}

// Guards a route: requires a session, and (when path is set) that it is the user's role home.
export function ProtectedRoute({ path, children }: Props) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-brand-blue" />
      </div>
    );
  }

  if (!session || !profile) return <Navigate to="/login" replace />;

  if (path && roleHome(profile) !== path) return <Navigate to={roleHome(profile)} replace />;

  return <>{children}</>;
}
