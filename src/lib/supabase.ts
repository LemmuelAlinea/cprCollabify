import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn (do not crash) so the UI still renders before keys are configured.
if (!url || !anonKey) {
  console.warn(
    "Supabase env vars missing. Copy .env.example to .env and set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_ANON_KEY, then restart the dev server. Auth will not work until then.",
  );
}

// Placeholder URL keeps createClient valid until real keys are provided.
export const supabase = createClient(
  url || "http://localhost:54321",
  anonKey || "public-anon-placeholder",
);
