import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { Avatar } from "../components/Avatar";

interface Props {
  title: string;
  pending?: boolean;
}

// Temporary authed landing per role; real dashboards come later.
export function Placeholder({ title, pending }: Props) {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/collabify-logo.png" alt="Collabify" className="h-8 w-8 object-contain" />
          <span className="text-lg font-700 tracking-tight">
            Collab<span className="text-gradient">ify</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex items-center gap-2 rounded-full border border-[var(--line)] py-1 pl-1 pr-3 transition-colors hover:border-brand-blue/40"
          >
            {profile && (
              <Avatar
                url={profile.avatarUrl}
                firstName={profile.firstName}
                lastName={profile.lastName}
                className="h-7 w-7 text-xs"
              />
            )}
            <span className="text-sm font-500">Settings</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8 text-center">
          <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-600 text-brand-blue">
            {title}
          </span>

          {pending ? (
            <>
              <h1 className="mt-5 text-2xl font-700 tracking-tight">Awaiting approval</h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                Thanks for registering, {profile?.firstName}. Your professor account is pending
                review by a BSIT admin. You will get access once it is approved.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-2xl font-700 tracking-tight">
                Welcome, {profile?.firstName || "there"}.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                You are signed in as{" "}
                <span className="font-600 text-[var(--ink)]">
                  {profile?.firstName} {profile?.lastName}
                </span>{" "}
                ({profile?.role}). Your dashboard is coming soon.
              </p>
            </>
          )}

          <button
            type="button"
            onClick={signOut}
            className="mt-8 w-full rounded-full border border-[var(--line)] px-6 py-3 text-sm font-500 transition-colors hover:border-brand-blue/40"
          >
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}
