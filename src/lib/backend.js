/* ============================================================
   Backend handle. When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   are set (see .env.example) the app syncs its operational data
   through Supabase so every browser sees the same loop. Without
   them it runs on this browser's localStorage only.

   The Supabase client (about 220 kB) is loaded on demand, after the
   first paint, so the page shows before the sync library arrives.
   ============================================================ */
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const BACKEND = url && key ? 'supabase' : 'local';
export const TABLE = 'shared_state';

let clientPromise = null;
/** the shared Supabase client, or null in local mode. Safe to call repeatedly. */
export function getClient() {
  if (BACKEND !== 'supabase') return Promise.resolve(null);
  clientPromise ||= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, key, { auth: { persistSession: false } }));
  return clientPromise;
}
