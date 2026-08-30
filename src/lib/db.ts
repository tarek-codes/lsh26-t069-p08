// Supabase Database Client Configuration (Optional Remote Integration)
// When NEXT_PUBLIC_SUPABASE_URL is not set, the system automatically runs on the fast in-memory store.

export interface DatabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const dbConfig: DatabaseConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};
