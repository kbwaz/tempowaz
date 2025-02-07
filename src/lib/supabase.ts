import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key are required. Please check your .env file.",
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error(
    `Invalid Supabase URL format. URL must start with https:// and be a valid URL. Current value: ${supabaseUrl}`,
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
