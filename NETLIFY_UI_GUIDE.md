# 🎯 Netlify UI Navigation Guide

## 📍 Where to Find Settings in Netlify

Netlify's UI can be a bit confusing, so here's the exact path to find the settings you need:

### Step 1: Go to Your Site

1. Go to https://app.netlify.com
2. Click on your site name in the list

### Step 2: Find Site Settings

**Option A: From the Site Overview**
- Click the **gear icon** (⚙️) in the top navigation bar
- This opens **Site settings**

**Option B: From the Left Sidebar**
- Look for **"Site settings"** or **"Settings"** in the left sidebar
- Click on it

**Alternative names you might see:**
- "Site settings"
- "Deploy settings"
- "Settings"
- "Site configuration"

### Step 3: Find Build Settings

Once in **Site settings**, look for:

**Left Sidebar Navigation:**
- **Build & deploy** → Click this
- Then look for **"Build settings"** section
- Or **"Deploy settings"** → **"Build settings"**

**What you're looking for:**
- A section labeled **"Build settings"** or **"Build configuration"**
- Should have fields for:
  - Build command
  - Publish directory
  - Framework
  - Node version

### Step 4: Edit Build Settings

1. In the **Build settings** section, click:
   - **"Edit settings"** button
   - **"Override"** button
   - **"Change settings"** button
   - Or a **pencil icon** (✏️)

2. You should see fields for:
   - **Build command:** Text field
   - **Publish directory:** Text field
   - **Framework:** Dropdown menu
   - **Auto-detect framework:** Toggle or checkbox
   - **Node version:** Dropdown or text field

### Step 5: Disable Framework Auto-Detection

**Look for one of these:**
1. **Toggle/Checkbox** labeled:
   - "Auto-detect framework"
   - "Detect framework automatically"
   - "Enable framework detection"

2. **Framework dropdown** showing:
   - "Next.js" (this is the problem!)
   - "Auto-detected: Next.js"
   - Change this to **"None"** or **"Other"**

3. **Clear/Reset button** next to framework detection

**What to do:**
- If there's a toggle, **turn it OFF**
- If there's a dropdown, select **"None"** or **"Other"**
- If it says "Auto-detected: Next.js", click **"Clear"** or **"Override"**

### Step 6: Set Build Command and Publish Directory

**Build command field:**
- Should say something like `npm run build` or `next build`
- **Change it to:** `npm run build:frontend`

**Publish directory field:**
- Should say something like `.next` or `build`
- **Change it to:** `dist`

### Step 7: Save Changes

- Click **"Save"** button
- Or **"Update"** button
- Or **"Deploy"** button

## 🔍 Visual Guide

Here's what the Netlify UI typically looks like:

```
Netlify Dashboard
├── Your Site Name
│   ├── Overview
│   ├── Deploys
│   ├── Site settings (⚙️) ← Click here
│   │   ├── General
│   │   ├── Build & deploy ← Click here
│   │   │   ├── Build settings ← Click "Edit settings" here
│   │   │   │   ├── Build command: [npm run build:frontend]
│   │   │   │   ├── Publish directory: [dist]
│   │   │   │   ├── Framework: [None] ← Change from "Next.js"
│   │   │   │   └── Auto-detect: [ ] ← Uncheck this
│   │   │   ├── Environment variables
│   │   │   └── Plugins
│   │   └── Domain settings
```

## 🎯 Quick Reference

### Where to Find Things:

| What You Need | Where to Find It |
|---------------|------------------|
| **Site settings** | Gear icon (⚙️) in top nav, or "Site settings" in sidebar |
| **Build settings** | Site settings → Build & deploy → Build settings |
| **Framework detection** | Build settings → Framework dropdown or Auto-detect toggle |
| **Build command** | Build settings → Build command field |
| **Publish directory** | Build settings → Publish directory field |
| **Plugins** | Site settings → Plugins (or Build & deploy → Plugins) |
| **Environment variables** | Site settings → Environment variables |

### What to Set:

| Setting | Value |
|---------|-------|
| **Framework** | None (or Other) |
| **Auto-detect framework** | OFF (unchecked) |
| **Build command** | `npm run build:frontend` |
| **Publish directory** | `dist` |
| **Base directory** | (leave empty) |

## 🐛 Can't Find It?

If you can't find the settings:

1. **Look for "Deploy settings"** instead of "Build & deploy"
2. **Look for "Build configuration"** instead of "Build settings"
3. **Check the left sidebar** - settings might be collapsed
4. **Try the search bar** - search for "build" or "framework"
5. **Check the top navigation** - settings might be in a dropdown menu

## 📸 Screenshot Guide

If you're still having trouble, here's what to look for in screenshots:

1. **Site settings page:**
   - Should have a left sidebar with options
   - Look for "Build & deploy" or "Deploy settings"

2. **Build settings page:**
   - Should have text fields for "Build command" and "Publish directory"
   - Should have a dropdown for "Framework"
   - Should have a toggle or checkbox for "Auto-detect framework"

3. **Framework dropdown:**
   - If it says "Next.js", that's the problem!
   - Change it to "None" or "Other"

## 🎉 Success Indicators

You'll know you've done it right when:

- ✅ Framework dropdown shows "None" (not "Next.js")
- ✅ Auto-detect framework is OFF (unchecked)
- ✅ Build command is `npm run build:frontend`
- ✅ Publish directory is `dist`
- ✅ No Next.js plugins in the Plugins section
- ✅ Build succeeds without Next.js plugin errors

---

**Still can't find it?** Take a screenshot of your Netlify UI and I can help you locate the exact settings!

