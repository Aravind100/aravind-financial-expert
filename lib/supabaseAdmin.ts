import { createClient } from '@supabase/supabase-js';

export function supabaseAdmin() {
  // Prefer the server-only SUPABASE_URL. Keep the public URL as a fallback
  // so existing deployments remain compatible.
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Prefer the modern Supabase secret key. Keep the legacy service-role
  // variable as a fallback during migration.
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Supabase URL is missing. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in Vercel.'
    );
  }

  if (!key) {
    throw new Error(
      'Supabase server key is missing. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY in Vercel.'
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
