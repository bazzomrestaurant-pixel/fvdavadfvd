import { createLazySupabaseClient } from "./supabaseClient";

const supabase = createLazySupabaseClient(
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
);

export { supabase };
export default supabase;
