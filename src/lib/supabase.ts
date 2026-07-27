import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether real Supabase credentials have been provided.
 * The rest of the app uses this flag to decide between hitting the live
 * database and falling back to the local mock dataset, so the frontend is
 * fully explorable before you've connected a project.
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes('your-project'),
);

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
