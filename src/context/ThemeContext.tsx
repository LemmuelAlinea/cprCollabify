import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference; // what the user chose
  theme: EffectiveTheme; // what is actually applied
  setPreference: (p: ThemePreference) => void;
  toggleTheme: () => void; // quick switch to explicit light/dark
}

const STORAGE_KEY = "collabify-theme";
const darkMedia = () => window.matchMedia("(prefers-color-scheme: dark)");

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Reads the stored preference; defaults to light for new visitors.
function getStoredPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // Ignore storage failures.
  }
  return "light";
}

// Resolves a preference to the concrete theme to apply.
function resolveEffective(pref: ThemePreference): EffectiveTheme {
  if (pref === "system") return darkMedia().matches ? "dark" : "light";
  return pref;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference);
  const [theme, setTheme] = useState<EffectiveTheme>(() => resolveEffective(getStoredPreference()));

  // Apply the effective theme and persist the preference.
  useEffect(() => {
    const effective = resolveEffective(preference);
    setTheme(effective);
    document.documentElement.classList.toggle("dark", effective === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage failures.
    }
  }, [preference]);

  // Follow OS changes live while in system mode.
  useEffect(() => {
    if (preference !== "system") return;
    const m = darkMedia();
    const onChange = () => {
      const effective = m.matches ? "dark" : "light";
      setTheme(effective);
      document.documentElement.classList.toggle("dark", effective === "dark");
    };
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = (p: ThemePreference) => setPreferenceState(p);
  const toggleTheme = () => setPreferenceState(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ preference, theme, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for consuming theme state and actions.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
