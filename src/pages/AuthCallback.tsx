import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../lib/roleHome";

// Landing page for the email confirmation link; routes on once the session is ready.
export default function AuthCallback() {
  const { loading, session, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (session && profile) navigate(roleHome(profile), { replace: true });
    else if (!session) navigate("/login", { replace: true });
    // session set but profile still loading: wait for the next tick.
  }, [loading, session, profile, navigate]);

  return (
    <AuthLayout title="Confirming your email" subtitle="One moment while we sign you in...">
      <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-brand-blue" />
    </AuthLayout>
  );
}
