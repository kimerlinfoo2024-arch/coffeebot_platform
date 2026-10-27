/* ============================================================
   Backend handle. When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   are set (see .env.example) the app syncs its operational data
   through Supabase so every browser sees the same loop. Without
   them it runs on this browser's localStorage only.
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
export const BACKEND = supabase ? 'supabase' : 'local';
export const TABLE = 'shared_state';
