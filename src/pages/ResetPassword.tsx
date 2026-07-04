import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { roleHome } from "../lib/roleHome";

// Landing page for the emailed recovery link; sets a new password.
export default function ResetPassword() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setDone(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <AuthLayout title="Reset password" subtitle="Verifying your link...">
        <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-brand-blue" />
      </AuthLayout>
    );
  }

  if (!session) {
    return (
      <AuthLayout title="Link expired" subtitle="This reset link is invalid or has expired.">
        <Link
          to="/forgot-password"
          className="block w-full rounded-full bg-brand-gradient px-6 py-3 text-center text-sm font-600 text-white shadow-brand"
        >
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" subtitle="Your password has been changed.">
        <button
          type="button"
          onClick={() => navigate(profile ? roleHome(profile) : "/login", { replace: true })}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your account.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-500">New password</label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={setPassword}
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-500">Confirm password</label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter your password"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? "Saving..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}
