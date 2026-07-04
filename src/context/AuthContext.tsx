import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AccountStatus, Profile, Role } from "../lib/roleHome";

interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Extract<Role, "professor" | "student">;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    input: SignUpInput,
  ) => Promise<{ error: string | null; profile: Profile | null; needsConfirmation: boolean }>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Where the email confirmation link returns the user.
const emailRedirectTo = () => `${window.location.origin}/auth/callback`;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Shape returned by the profiles + roles join.
interface ProfileRow {
  id: string;
  status: AccountStatus;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  roles: { name: Role } | null;
}

// Fetches the caller's profile joined with its role name.
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, status, first_name, last_name, avatar_url, roles(name)")
    .eq("id", userId)
    .single<ProfileRow>();

  if (error || !data || !data.roles) return null;
  return {
    id: data.id,
    role: data.roles.name,
    status: data.status,
    firstName: data.first_name,
    lastName: data.last_name,
    avatarUrl: data.avatar_url,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Load any existing session, then keep in sync with auth changes.
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      setProfile(data.session ? await fetchProfile(data.session.user.id) : null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!active) return;
      setSession(next);
      setProfile(next ? await fetchProfile(next.user.id) : null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (input: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: { first_name: input.firstName, last_name: input.lastName, role: input.role },
        emailRedirectTo: emailRedirectTo(),
      },
    });
    if (error || !data.user) {
      return { error: error?.message ?? "Sign up failed", profile: null, needsConfirmation: false };
    }

    // No session means email confirmation is required before sign-in.
    if (!data.session) return { error: null, profile: null, needsConfirmation: true };

    // Confirmation disabled: profile is created by the DB trigger; read it back for redirect.
    const created = await fetchProfile(data.user.id);
    setProfile(created);
    return { error: null, profile: created, needsConfirmation: false };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: emailRedirectTo() },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  // Re-reads the current user's profile after edits (name, avatar).
  const refreshProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) setProfile(await fetchProfile(data.user.id));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signIn,
        signUp,
        resendConfirmation,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming auth state and actions.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
