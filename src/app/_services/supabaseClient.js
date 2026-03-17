import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with lazy initialization.
 * This ensures errors only occur at runtime if env vars are missing,
 * not during build time.
 */
function createLazySupabaseClient(urlVar, keyVar, options = {}) {
  let client = null;

  return new Proxy(
    {},
    {
      get(target, prop) {
        if (!client) {
          const url = process.env[urlVar];
          const key = process.env[keyVar];

          if (!url || !key) {
            throw new Error(
              `Missing Supabase environment variables: ${urlVar} or ${keyVar}`,
            );
          }

          client = createClient(url, key, options);
        }

        return client[prop];
      },
    },
  );
}

export { createLazySupabaseClient };
