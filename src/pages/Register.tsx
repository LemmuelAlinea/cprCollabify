import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../lib/roleHome";

type SignupRole = "student" | "professor";

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--ink-soft)]/60 focus:border-brand-blue";

// Registration with a Student/Professor role toggle.
export default function Register() {
  const { profile, signUp, resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<SignupRole>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  if (profile) return <Navigate to={roleHome(profile)} replace />;

  const onResend = async () => {
    if (!sentTo) return;
    setResendMsg(null);
    setResending(true);
    const { error } = await resendConfirmation(sentTo);
    setResendMsg(error ?? "Confirmation email sent again.");
    setResending(false);
  };

  const validate = (): string | null => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter your first and last name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await signUp({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      role,
    });
    if (res.error) {
      setError(res.error);
      setSubmitting(false);
      return;
    }
    if (res.needsConfirmation) {
      setSentTo(email.trim());
      setSubmitting(false);
      return;
    }
    navigate(res.profile ? roleHome(res.profile) : "/login", { replace: true });
  };

  // Post-signup: email confirmation required.
  if (sentTo) {
    return (
      <AuthLayout title="Confirm your email" subtitle="You're almost there.">
        <div className="space-y-4">
          <p className="rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm text-[var(--ink)]">
            We sent a confirmation link to <span className="font-600">{sentTo}</span>. Click it to
            activate your account, then log in.
          </p>
          {resendMsg && <p className="text-sm text-[var(--ink-soft)]">{resendMsg}</p>}
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="w-full rounded-full border border-[var(--line)] px-6 py-3 text-sm font-500 transition-colors hover:border-brand-blue/40 disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend confirmation email"}
          </button>
          <Link to="/login" className="block text-center text-sm font-600 text-brand-blue hover:underline">
            Back to log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join your class on Collabify.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Role toggle */}
        <div>
          <span className="mb-1.5 block text-sm font-500">I am a</span>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] p-1">
            {(["student", "professor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg px-4 py-2 text-sm font-500 capitalize transition-colors ${
                  role === r
                    ? "bg-brand-gradient text-white shadow-brand"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {role === "professor" && (
            <p className="mt-2 text-xs text-[var(--ink-soft)]">
              Professor accounts require BSIT admin approval before you can access your dashboard.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-500">
              First name
            </label>
            <input
              id="firstName"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              placeholder="Juan"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-500">
              Last name
            </label>
            <input
              id="lastName"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              placeholder="Dela Cruz"
            />
          </div>
        </div>

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
          <label htmlFor="password" className="mb-1.5 block text-sm font-500">
            Password
          </label>
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
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-500">
            Confirm password
          </label>
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
          disabled={submitting}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
        Already have an account?{" "}
        <Link to="/login" className="font-600 text-brand-blue hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
