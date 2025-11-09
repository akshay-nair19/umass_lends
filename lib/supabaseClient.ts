/**
 * Supabase client configuration
 * Creates both client-side and server-side Supabase clients
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid throwing errors at module load time
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

/**
 * Get Supabase URL and keys from environment variables
 * Checks both NEXT_PUBLIC_ and VITE_ prefixes for compatibility
 */
function getSupabaseConfig() {
  const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL ||
    (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_URL);
    
  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.VITE_SUPABASE_ANON_KEY ||
    (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
  const supabaseServiceRoleKey = 
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
      `Please set them in Vercel dashboard under Settings > Environment Variables. ` +
      `Current env keys: ${Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(', ') || 'none'}`
    );
  }

  return { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey };
}

/**
 * Get or create the client-side Supabase client (uses anon key)
 * Use this in client components and API routes that need user context
 */
function createSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Get or create the server-side Supabase client (uses service role key for admin operations)
 * Use this in API routes that need to bypass RLS
 */
function createSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseAdminClient) {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } = getSupabaseConfig();
    
    if (supabaseServiceRoleKey) {
      supabaseAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }
  return supabaseAdminClient;
}

/**
 * Client-side Supabase client (uses anon key)
 * Use this in client components and API routes that need user context
 * Lazy-loaded to avoid errors at module load time
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = createSupabaseClient();
    const value = (client as any)[prop];
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

/**
 * Server-side Supabase client (uses service role key for admin operations)
 * Use this in API routes that need to bypass RLS
 * Lazy-loaded to avoid errors at module load time
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient | null, {
  get(_target, prop) {
    const admin = createSupabaseAdminClient();
    if (!admin) return null;
    const value = (admin as any)[prop];
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(admin);
    }
    return value;
  }
}) as SupabaseClient | null;

/**
 * Get Supabase client based on context
 * @param useAdmin - Whether to use admin client (bypasses RLS)
 * @returns Supabase client
 */
export function getSupabaseClient(useAdmin: boolean = false): SupabaseClient {
  if (useAdmin) {
    const admin = createSupabaseAdminClient();
    if (!admin) {
      throw new Error('Supabase admin client not available. SUPABASE_SERVICE_ROLE_KEY is required for admin operations.');
    }
    return admin;
  }
  return createSupabaseClient();
}

