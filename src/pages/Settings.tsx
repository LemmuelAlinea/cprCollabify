import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme, type ThemePreference } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";
import { roleHome } from "../lib/roleHome";
import { Avatar } from "../components/Avatar";
import { ThemeToggle } from "../components/ThemeToggle";

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--ink-soft)]/60 focus:border-brand-blue disabled:opacity-60";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type SectionId = "profile" | "security" | "appearance";

const nav: { id: SectionId; label: string; icon: ReactNode }[] = [
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Security",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
];

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

// Account settings with a desktop section-nav sidebar and a wide content panel.
export default function Settings() {
  const { profile, user, refreshProfile } = useAuth();
  const { preference, setPreference } = useTheme();

  const fileInput = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState<SectionId>("profile");
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarErr, setAvatarErr] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!profile || !user) return null;

  const onPickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setAvatarErr(null);
    if (!file.type.startsWith("image/")) return setAvatarErr("Please choose an image file.");
    if (file.size > MAX_AVATAR_BYTES) return setAvatarErr("Image must be under 2 MB.");

    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const up = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (up.error) {
      setAvatarErr(up.error.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const upd = await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", user.id);
    if (upd.error) setAvatarErr(upd.error.message);
    else await refreshProfile();
    setUploading(false);
  };

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!firstName.trim() || !lastName.trim()) {
      setProfileMsg({ ok: false, text: "Name cannot be empty." });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq("id", user.id);
    if (error) setProfileMsg({ ok: false, text: error.message });
    else {
      await refreshProfile();
      setProfileMsg({ ok: true, text: "Profile updated." });
    }
    setSaving(false);
  };

  const onSendReset = async () => {
    if (!user.email) return;
    setResetMsg(null);
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setResetMsg({ ok: false, text: error.message });
    else setResetMsg({ ok: true, text: "Check your inbox for a password reset link." });
    setResetting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/collabify-logo.png" alt="Collabify" className="h-8 w-8 object-contain" />
            <span className="text-lg font-700 tracking-tight">
              Collab<span className="text-gradient">ify</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to={roleHome(profile)}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-500 transition-colors hover:border-brand-blue/40"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <h1 className="text-2xl font-700 tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">Manage your profile, security, and appearance.</p>

        <div className="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Section navigation */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="mb-4 hidden items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-4 lg:flex">
              <Avatar url={profile.avatarUrl} firstName={profile.firstName} lastName={profile.lastName} className="h-11 w-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-600">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="truncate text-xs text-[var(--ink-soft)]">{user.email}</p>
              </div>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {nav.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSection(n.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-500 transition-colors ${
                    section === n.id
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-[var(--ink-soft)] hover:bg-[var(--bg-elevated)] hover:text-[var(--ink)]"
                  }`}
                >
                  {n.icon}
                  {n.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="mt-6 lg:mt-0">
            {section === "profile" && (
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:p-8">
                <h2 className="text-lg font-600">Profile</h2>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">Your name and photo.</p>

                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Avatar url={profile.avatarUrl} firstName={profile.firstName} lastName={profile.lastName} className="h-20 w-20 text-xl" />
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      disabled={uploading}
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-500 transition-colors hover:border-brand-blue/40 disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload photo"}
                    </button>
                    <p className="mt-1.5 text-xs text-[var(--ink-soft)]">JPG or PNG, up to 2 MB.</p>
                    {avatarErr && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{avatarErr}</p>}
                  </div>
                  <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
                </div>

                <form onSubmit={onSaveProfile} className="mt-8 max-w-xl space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="mb-1.5 block text-sm font-500">First name</label>
                      <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="mb-1.5 block text-sm font-500">Last name</label>
                      <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-500">Email</label>
                    <input id="email" value={user.email ?? ""} disabled className={inputClass} />
                    <p className="mt-1 text-xs text-[var(--ink-soft)]">Email changes are coming soon.</p>
                  </div>

                  {profileMsg && (
                    <p className={`text-sm ${profileMsg.ok ? "text-brand-green" : "text-red-600 dark:text-red-400"}`}>
                      {profileMsg.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </form>
              </section>
            )}

            {section === "security" && (
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:p-8">
                <h2 className="text-lg font-600">Security</h2>
                <p className="mt-2 max-w-xl text-sm text-[var(--ink-soft)]">
                  We will email a secure link to <span className="font-500 text-[var(--ink)]">{user.email}</span> so
                  you can set a new password.
                </p>
                {resetMsg && (
                  <p className={`mt-3 text-sm ${resetMsg.ok ? "text-brand-green" : "text-red-600 dark:text-red-400"}`}>
                    {resetMsg.text}
                  </p>
                )}
                <button
                  type="button"
                  onClick={onSendReset}
                  disabled={resetting}
                  className="mt-5 rounded-full border border-[var(--line)] px-6 py-2.5 text-sm font-500 transition-colors hover:border-brand-blue/40 disabled:opacity-60"
                >
                  {resetting ? "Sending..." : "Send password reset link"}
                </button>
              </section>
            )}

            {section === "appearance" && (
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:p-8">
                <h2 className="text-lg font-600">Appearance</h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">Choose how Collabify looks on this device.</p>
                <div className="mt-5 grid max-w-md grid-cols-3 gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1">
                  {themeOptions.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setPreference(o.value)}
                      className={`rounded-lg px-4 py-2 text-sm font-500 transition-colors ${
                        preference === o.value
                          ? "bg-brand-gradient text-white shadow-brand"
                          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
