/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // This is a backend-only Next.js deployment (API routes only)
  // The frontend is a separate Vite app in src/ directory
  // Next.js should ONLY process app/ directory (App Router)
  
  // Ensure environment variables are available during build and runtime
  // Note: NEXT_PUBLIC_ variables are automatically available in Next.js
  // This mapping is for fallback compatibility with VITE_ prefixed variables
  // Only set if they exist - don't use empty strings as that masks missing variables
  env: {
    // These will be available as process.env.NEXT_PUBLIC_SUPABASE_URL in both client and server
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL && { NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL }),
    ...(process.env.VITE_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL && { NEXT_PUBLIC_SUPABASE_URL: process.env.VITE_SUPABASE_URL }),
    ...(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && { NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }),
    ...(process.env.VITE_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && { NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY }),
    // Service role key is server-only, so it doesn't need NEXT_PUBLIC_ prefix
    // It will be available as process.env.SUPABASE_SERVICE_ROLE_KEY automatically
  },
  
  // Skip linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure webpack
  webpack: (config) => {
    // Make sure webpack can handle both CommonJS and ESM
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    return config;
  },
}

module.exports = nextConfig

