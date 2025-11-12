# 🚀 Netlify Deployment Setup

## ⚠️ Important: Disable Next.js Auto-Detection

Netlify automatically detects Next.js in your repository and tries to run the `@netlify/plugin-nextjs` plugin. You **must disable this in the Netlify UI** since you're only deploying the Vite frontend.

## 📋 Step-by-Step Setup

### Step 1: Commit Changes

Make sure `netlify.toml` is committed to your repository:

```bash
git add netlify.toml
git commit -m "Add Netlify configuration for Vite frontend"
git push
```

### Step 2: Disable Framework Auto-Detection in Netlify UI

**This is the critical step!** You must disable framework detection:

1. Go to your Netlify dashboard: https://app.netlify.com
2. Click on your site
3. Go to **Site settings** (gear icon) - this may also be called "Deploy settings" or "Settings"
4. In the left sidebar, click on **Build & deploy** (or **Deploy settings**)
5. Scroll down to **Build settings** section
6. Click **Edit settings** or **Override** button
7. **Disable** or **Clear** the "Auto-detected framework" setting
   - Look for a toggle or checkbox that says "Auto-detect framework" or "Detect framework"
   - If you see "Framework: Next.js" or "Auto-detected: Next.js", disable it
8. Set **Framework** dropdown to **None** or **Other** (NOT "Next.js")
9. **Save** or **Update** changes

### Step 3: Configure Build Settings

Still in **Build & deploy > Build settings** (or **Deploy settings > Build settings**):

1. **Build command:** Set to `npm run build:frontend`
   - This should be in a text field labeled "Build command"
2. **Publish directory:** Set to `dist`
   - This should be in a text field labeled "Publish directory"
3. **Base directory:** Leave empty (or blank)
4. **Node version:** Can be set to 18 (optional, already set in `netlify.toml`)

**Save** or **Update** these settings.

### Step 4: Remove Next.js Plugin

1. In **Site settings** (gear icon), look in the left sidebar
2. Click on **Plugins** (or **Build plugins**)
3. Look for **"@netlify/plugin-nextjs"** or **"Next.js Runtime"** or **"Essential Next.js Plugin"**
4. If found, click **Remove** or **Disable** button
5. **Save** changes if prompted

### Step 5: Set Environment Variables

1. In **Site settings** (gear icon), look in the left sidebar
2. Click on **Environment variables** (or **Build & deploy > Environment**)
3. Click **Add variable** or **Edit variables** button
4. Add these variables one by one:
   ```
   Key: VITE_API_URL
   Value: https://your-backend-url.vercel.app
   
   Key: VITE_SUPABASE_URL
   Value: your_supabase_url
   
   Key: VITE_SUPABASE_ANON_KEY
   Value: your_supabase_anon_key
   ```
   **⚠️ Replace `https://your-backend-url.vercel.app` with your actual backend URL!**
5. Click **Save** for each variable

### Step 6: Test Build Locally

Before deploying, test the build locally:

```bash
# Install dependencies
npm ci

# Run the build
npm run build:frontend

# Verify dist folder is created
ls dist
```

If the build succeeds locally, it should work on Netlify.

### Step 7: Deploy

1. Go to **Deploys** tab
2. Click **Clear cache and deploy site**
3. Wait for build to complete

## ✅ Expected Build Output

You should see:
```
vite v7.2.2 building client environment for production...
✓ 150 modules transformed.
✓ built in 1.81s
dist/index.html                            0.63 kB
dist/assets/index-DBjcmvGg.css            28.56 kB
dist/assets/index-BDRyVy3u.js            124.37 kB
...
Build completed successfully!
```

**No Next.js plugin errors!**

## 🐛 Troubleshooting

### Error: "Next.js plugin failed"

**Problem:** Netlify is still detecting Next.js

**Solution:**
1. Go to **Site settings > Build & deploy > Build settings**
2. **Disable** framework auto-detection
3. Set **Framework** to **None**
4. Remove any Next.js plugins from **Plugins** section
5. **Save** and redeploy

### Error: "Build command not found"

**Problem:** `npm run build:frontend` doesn't exist

**Solution:**
1. Check `package.json` has `build:frontend` script
2. Verify `package.json` is committed to repo
3. Run `npm ci` locally to verify dependencies install correctly

### Error: "Cannot find module"

**Problem:** Missing dependencies

**Solution:**
1. Check `package-lock.json` is committed to repo
2. Run `npm ci` locally to verify
3. Check build logs for specific missing modules

### Error: "EPERM: operation not permitted"

**Problem:** Windows file locking issue (local testing only)

**Solution:**
- This only happens locally on Windows
- Netlify uses Linux, so this won't happen on Netlify
- For local testing, close any programs that might lock files (IDE, file explorer)

### Plugin Keeps Reappearing

**Problem:** Netlify keeps re-detecting Next.js

**Solution:**
1. Make sure framework detection is **disabled** in UI
2. Set build command manually (don't rely on auto-detection)
3. Set publish directory manually
4. Clear cache and redeploy
5. If it still happens, contact Netlify support

## ✅ Verification Checklist

- [ ] `netlify.toml` is committed to repo
- [ ] Framework auto-detection is **disabled** in Netlify UI
- [ ] Build command: `npm run build:frontend`
- [ ] Publish directory: `dist`
- [ ] Framework set to **None** or **Other**
- [ ] No Next.js plugins installed
- [ ] Environment variables set (VITE_API_URL, etc.)
- [ ] `package-lock.json` is committed
- [ ] Build works locally (`npm run build:frontend`)
- [ ] Cache cleared
- [ ] New deploy triggered
- [ ] Build completes without errors
- [ ] Site loads correctly

## 🎉 After Success

Once the build succeeds:
- Your frontend will be live on Netlify
- It will connect to your backend on Vercel
- Check browser console to verify: `[API] API_BASE URL: https://your-backend.vercel.app`

## 📝 Quick Reference

### Netlify Settings

**Build & deploy > Build settings:**
- Build command: `npm run build:frontend`
- Publish directory: `dist`
- Framework: **None** (disabled)
- Node version: 18

**Environment variables:**
- `VITE_API_URL` - Your backend URL
- `VITE_SUPABASE_URL` - Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

### Files

- `netlify.toml` - Netlify configuration
- `package.json` - Has `build:frontend` script
- `vite.config.js` - Vite configuration
- `dist/` - Build output (generated)

---

## 🔑 Key Points

1. **Disable framework auto-detection** in Netlify UI (critical!)
2. **Remove Next.js plugin** if it's installed
3. **Set build command manually**: `npm run build:frontend`
4. **Set publish directory manually**: `dist`
5. **Set environment variables** correctly

The `netlify.toml` file helps, but the **UI settings are the most important** to prevent Next.js detection.

