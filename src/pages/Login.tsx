import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../lib/roleHome";

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--ink-soft)]/60 focus:border-brand-blue";

// Email/password sign-in; redirects to the role home once the profile loads.
export default function Login() {
  const { profile, signIn, resendConfirmation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  if (profile) return <Navigate to={roleHome(profile)} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnconfirmed(false);
    setResendMsg(null);
    setSubmitting(true);
    const res = await signIn(email.trim(), password);
    if (res.error) {
      // Supabase reports an unconfirmed email; offer a resend instead of a raw error.
      if (/not confirmed/i.test(res.error)) setUnconfirmed(true);
      else setError(res.error);
      setSubmitting(false);
    }
    // On success the profile loads and the guard above redirects.
  };

  const onResend = async () => {
    setResendMsg(null);
    setResending(true);
    const { error } = await resendConfirmation(email.trim());
    setResendMsg(error ?? "Confirmation email sent. Check your inbox.");
    setResending(false);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your Collabify account.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {unconfirmed && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
            <p className="text-[var(--ink)]">Please confirm your email before logging in.</p>
            {resendMsg ? (
              <p className="mt-1.5 text-[var(--ink-soft)]">{resendMsg}</p>
            ) : (
              <button
                type="button"
                onClick={onResend}
                disabled={resending}
                className="mt-1.5 font-600 text-brand-blue hover:underline disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend confirmation email"}
              </button>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@school.edu.ph"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-500">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
        Don't have an account?{" "}
        <Link to="/register" className="font-600 text-brand-blue hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
