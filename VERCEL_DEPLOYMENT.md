# Vercel Deployment Guide

## Environment Variables Setup

To fix the build error on Vercel, you need to set the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Get it from: Supabase Dashboard → Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Get it from: Supabase Dashboard → Settings → API → anon public key

3. **SUPABASE_SERVICE_ROLE_KEY** (for backend API routes)
   - Your Supabase service role key (keep this secret!)
   - Get it from: Supabase Dashboard → Settings → API → service_role key

### Optional Environment Variables

4. **VITE_SUPABASE_URL** (for Vite frontend, if deploying separately)
   - Same value as NEXT_PUBLIC_SUPABASE_URL

5. **VITE_SUPABASE_ANON_KEY** (for Vite frontend, if deploying separately)
   - Same value as NEXT_PUBLIC_SUPABASE_ANON_KEY

6. **VITE_API_URL** (for Vite frontend)
   - Your deployed API URL (e.g., `https://your-project.vercel.app`)

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables**
4. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase URL
   - **Environment**: Select all (Production, Preview, Development)
5. Repeat for all required variables
6. **Redeploy** your project after adding variables

## Project Structure

This project has a hybrid setup:
- **Next.js Backend**: API routes in `app/api/` (deployed on Vercel)
- **Vite Frontend**: React app in `src/` (can be deployed separately or served statically)

## Build Configuration

The `next.config.js` has been configured to:
- Handle both Vite and Next.js environment variable syntax
- Support the hybrid frontend/backend setup
- Provide fallback values during build to prevent errors

## Troubleshooting

### Build Error: "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"

**Solution**: Make sure you've set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.

### Build Error: "Missing Supabase environment variables"

**Solution**: 
1. Check that all required environment variables are set in Vercel
2. Make sure you've selected the correct environment (Production, Preview, Development)
3. Redeploy after adding variables

### API Calls Failing

**Solution**: Make sure `VITE_API_URL` is set to your deployed Vercel URL (e.g., `https://your-project.vercel.app`)

## Notes

- The code has been updated to work in both Vite and Next.js environments
- Environment variables prefixed with `NEXT_PUBLIC_` are available to both server and client in Next.js
- Environment variables prefixed with `VITE_` are only available in Vite builds
- The build process now uses fallback values to prevent build errors if env vars are missing

