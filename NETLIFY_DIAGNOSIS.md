# 🔍 Netlify Build Diagnosis Guide

## ✅ Local Build Test

The build works locally! Run this to verify:

```bash
npm ci
npm run build:frontend
```

**Expected output:**
```
✓ 150 modules transformed.
✓ built in 2.82s
dist/index.html                            0.65 kB
dist/assets/index-DBjcmvGg.css            28.56 kB
...
```

If this works locally, the issue is **Netlify configuration**, not your code.

## 🔑 Root Cause

Netlify is **auto-detecting Next.js** in your repository and trying to run the `@netlify/plugin-nextjs` plugin. This happens **before** the build command runs, so it can't be prevented with build scripts.

## ✅ Solution: Disable Framework Detection in Netlify UI

You **must disable framework auto-detection** in Netlify UI. The `netlify.toml` file alone is not enough.

### Step-by-Step Fix

#### Step 1: Go to Netlify Dashboard

1. Go to https://app.netlify.com
2. Click on your site
3. Go to **Site settings** (gear icon)

#### Step 2: Disable Framework Auto-Detection

1. Go to **Build & deploy**
2. Scroll to **Build settings**
3. Click **Edit settings** or **Override**
4. **Disable** or **Clear** the "Auto-detected framework" setting
5. Set **Framework** to **None** or **Other** (NOT "Next.js")
6. **Save** changes

#### Step 3: Manually Set Build Settings

In **Build & deploy > Build settings**:

1. **Build command:** `npm run build:frontend`
2. **Publish directory:** `dist`
3. **Base directory:** (leave empty)
4. **Node version:** 18 (optional, set in netlify.toml)

**Save** these settings.

#### Step 4: Remove Next.js Plugin

1. In **Site settings**, go to **Plugins**
2. Look for **"@netlify/plugin-nextjs"** or **"Next.js Runtime"**
3. If found, click **Remove** or **Disable**
4. **Save** changes

#### Step 5: Set Environment Variables

1. In **Site settings**, go to **Environment variables**
2. Add these variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   **⚠️ Replace with your actual backend URL!**

#### Step 6: Clear Cache and Deploy

1. Go to **Deploys** tab
2. Click **Clear cache and deploy site**
3. Wait for build to complete

## 📋 Verification Checklist

Use this checklist to verify your Netlify settings:

- [ ] **Framework auto-detection is DISABLED** in UI
- [ ] **Framework is set to None** (not "Next.js")
- [ ] **Build command:** `npm run build:frontend`
- [ ] **Publish directory:** `dist`
- [ ] **No Next.js plugins** installed
- [ ] **Environment variables** set (VITE_API_URL, etc.)
- [ ] **package-lock.json** is committed to repo
- [ ] **netlify.toml** is committed to repo
- [ ] **Build works locally** (`npm run build:frontend`)
- [ ] **Cache cleared** before redeploy
- [ ] **New deploy triggered**

## 🐛 Common Errors and Solutions

### Error: "Plugin @netlify/plugin-nextjs failed"

**Cause:** Netlify is detecting Next.js and trying to run the plugin

**Solution:**
1. **Disable framework auto-detection** in Netlify UI (critical!)
2. **Remove Next.js plugin** from Plugins section
3. **Set Framework to None** in build settings
4. **Clear cache** and redeploy

### Error: "Build command not found"

**Cause:** `npm run build:frontend` doesn't exist

**Solution:**
1. Check `package.json` has `build:frontend` script ✅
2. Verify `package.json` is committed to repo
3. Run `npm ci` locally to verify dependencies install

### Error: "Cannot find module"

**Cause:** Missing dependencies

**Solution:**
1. Check `package-lock.json` is committed to repo
2. Run `npm ci` locally to verify
3. Check build logs for specific missing modules

### Error: "Deploy succeeded, no files"

**Cause:** Wrong publish directory

**Solution:**
1. Set **Publish directory** to `dist`
2. Verify `dist` folder is created after build
3. Check `netlify.toml` has `publish = "dist"`

### Error: "EPERM: operation not permitted" (local only)

**Cause:** Windows file locking (local testing only)

**Solution:**
- This only happens locally on Windows
- Netlify uses Linux, so this won't happen on Netlify
- Close any programs that might lock files (IDE, file explorer)

## 📊 Build Log Analysis

When you get the build log from Netlify, look for:

1. **Plugin detection:** Does it say "Detected Next.js" or "Installing @netlify/plugin-nextjs"?
   - If yes: Framework detection is still enabled
   - Fix: Disable framework auto-detection in UI

2. **Build command:** Does it run `npm run build:frontend`?
   - If no: Build command is not set correctly
   - Fix: Set build command to `npm run build:frontend`

3. **Publish directory:** Does it look for files in `dist`?
   - If no: Publish directory is not set correctly
   - Fix: Set publish directory to `dist`

4. **Dependencies:** Does it install dependencies correctly?
   - If no: Check `package-lock.json` is committed
   - Fix: Commit `package-lock.json` and redeploy

## 🎯 Quick Fix Summary

**The #1 issue:** Framework auto-detection is enabled in Netlify UI

**The #1 fix:** Disable framework auto-detection and set Framework to None

**Steps:**
1. Netlify Dashboard → Site settings → Build & deploy
2. Edit build settings
3. Disable framework auto-detection
4. Set Framework to None
5. Set Build command: `npm run build:frontend`
6. Set Publish directory: `dist`
7. Remove Next.js plugin
8. Clear cache and redeploy

## 📝 Files Checklist

Make sure these files are committed:

- [x] `netlify.toml` - Netlify configuration
- [x] `package.json` - Has `build:frontend` script
- [x] `package-lock.json` - Dependency lock file
- [x] `vite.config.js` - Vite configuration
- [x] `src/` - Frontend source code
- [x] `index.html` - HTML entry point

## 🎉 After Success

Once the build succeeds:
- Your frontend will be live on Netlify
- It will connect to your backend on Vercel
- Check browser console to verify: `[API] API_BASE URL: https://your-backend.vercel.app`

---

## 💡 Key Insight

**Netlify detects frameworks BEFORE the build command runs.** So even if you hide files in a build script, Netlify has already detected Next.js. The solution is to **disable framework auto-detection in the Netlify UI**, not in build scripts.

---

**Need more help?** Paste the full build log from Netlify (Site Deploys → deploy → "Show all logs") and I can identify the exact issue.

