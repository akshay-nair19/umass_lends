import { createClient } from "@supabase/supabase-js";

// Support both Vite (import.meta.env) and Next.js (process.env) environments
// This allows the file to work in both Vite frontend and Next.js build contexts
const getEnvVar = (viteKey, nextKey) => {
  // Check if we're in a Vite environment (has import.meta.env)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }
  } catch (e) {
    // import.meta not available (Next.js environment)
  }
  
  // Check if we're in a Node.js/Next.js environment (has process.env)
  try {
    if (typeof process !== 'undefined' && process.env) {
      // Try Next.js public env var first, then fall back to Vite name
      return process.env[nextKey] || process.env[viteKey];
    }
  } catch (e) {
    // process not available
  }
  
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create client with fallback values to prevent build errors
// In production/runtime, the actual env vars should be available
const finalUrl = supabaseUrl || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 'placeholder-key';

// Only log error in browser runtime, not during Next.js build
if ((!supabaseUrl || !supabaseAnonKey) && typeof window !== 'undefined') {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please add to your .env file:');
  console.error('VITE_SUPABASE_URL=your_supabase_url (for Vite)');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url (for Next.js)');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key (for Vite)');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key (for Next.js)');
}

export const supabase = createClient(finalUrl, finalKey);