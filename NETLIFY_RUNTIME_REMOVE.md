# ✅ Remove Next.js Runtime from Netlify

## 🎯 What You Found

You're looking at the **Runtime** section which shows:
- **Runtime:** Next.js
- **Remove** button

This is the Next.js plugin that Netlify automatically detected. You need to **remove it**.

## ✅ What to Do

### Step 1: Remove Next.js Runtime

1. Click the **"Remove"** button next to "Next.js"
2. Confirm the removal if prompted
3. **Save** changes if there's a save button

### Step 2: Verify It's Removed

After clicking "Remove", the Next.js runtime should disappear from the list.

### Step 3: Still Configure Build Settings

Even after removing the runtime, you should also:

1. Go to **Build settings** section (same page or nearby)
2. Set **Framework** to **"None"** (if there's a dropdown)
3. Set **Build command** to `npm run build:frontend`
4. Set **Publish directory** to `dist`
5. Turn **OFF** "Auto-detect framework" (if there's a toggle)
6. **Save** changes

### Step 4: Deploy

1. Go to **Deploys** tab
2. Click **"Clear cache and deploy site"**
3. Wait for build to complete

## ✅ Expected Result

After removing the Next.js runtime:

1. ✅ Next.js runtime is removed from the list
2. ✅ Build settings show Framework: None
3. ✅ Build command: `npm run build:frontend`
4. ✅ Publish directory: `dist`
5. ✅ Build succeeds without Next.js plugin errors

## 🎉 Success!

Once you've removed the Next.js runtime and configured the build settings:

1. **Trigger a new deploy**
2. **Check the build logs** - you should see:
   ```
   vite v7.2.2 building client environment for production...
   ✓ 150 modules transformed.
   ✓ built in 1.81s
   ```
3. **No Next.js plugin errors!**

## 📋 Checklist

- [ ] Clicked "Remove" next to Next.js runtime
- [ ] Next.js runtime is removed from the list
- [ ] Build settings: Framework set to "None"
- [ ] Build settings: Build command set to `npm run build:frontend`
- [ ] Build settings: Publish directory set to `dist`
- [ ] Build settings: Auto-detect framework is OFF
- [ ] Environment variables set (VITE_API_URL, etc.)
- [ ] Cache cleared
- [ ] New deploy triggered
- [ ] Build succeeds without errors

## 🐛 If "Remove" Doesn't Work

If clicking "Remove" doesn't work or the runtime keeps coming back:

1. **Check Build settings** - Make sure Framework is set to "None"
2. **Disable auto-detect** - Turn off framework auto-detection
3. **Clear cache** - Clear Netlify build cache
4. **Redeploy** - Trigger a new deploy
5. **Check Plugins section** - Look for Next.js plugins there too

## 💡 Why This Works

The Next.js runtime is the `@netlify/plugin-nextjs` plugin that Netlify automatically installed when it detected Next.js files in your repository. By removing it, Netlify won't try to run Next.js build commands, and it will use your Vite build command instead.

---

**Click "Remove" now and then verify your build settings are correct!**

