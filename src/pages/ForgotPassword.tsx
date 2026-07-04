import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { supabase } from "../lib/supabase";

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--ink-soft)]/60 focus:border-brand-blue";

// Logged-out password reset request; emails a reset link.
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setSending(false);
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to set a new one.">
      {sent ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm text-[var(--ink)]">
            If an account exists for <span className="font-600">{email}</span>, a reset link is on its way.
          </p>
          <Link to="/login" className="block text-center text-sm font-600 text-brand-blue hover:underline">
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-500">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@school.edu.ph"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {sending ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
            Remembered it?{" "}
            <Link to="/login" className="font-600 text-brand-blue hover:underline">Log in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
