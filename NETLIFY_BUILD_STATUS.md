# 🔍 Netlify Build Status vs Build Settings

## ⚠️ What You're Looking At

The **"Build status"** / **"Active builds"** / **"Stopped builds"** setting is **NOT** what you need to fix the Next.js plugin issue.

This setting controls:
- **Active builds**: Netlify automatically builds when you push to Git (recommended)
- **Stopped builds**: Netlify won't build automatically (you build manually)

**This is fine to leave as "Active builds"** - that's the default and what you want.

## ✅ What You Actually Need

You need to go to **Build settings** (not Build status) to:
1. Disable framework auto-detection
2. Set build command: `npm run build:frontend`
3. Set publish directory: `dist`
4. Set Framework to "None"

## 📍 Exact Navigation Path

### Step 1: Go to Build & Deploy Settings

1. Netlify Dashboard → Click your site
2. Click **gear icon** (⚙️) or "Site settings"
3. In left sidebar, click **"Build & deploy"**
4. You should see several sections:
   - **Build status** ← This is what you're looking at (not what you need)
   - **Build settings** ← **THIS is what you need!**
   - **Continuous Deployment**
   - **Environment variables**
   - **Plugins**

### Step 2: Go to Build Settings

1. Scroll down to **"Build settings"** section
2. Click **"Edit settings"** or **"Override"** button
3. You should see fields for:
   - **Build command**
   - **Publish directory**
   - **Framework** (dropdown)
   - **Auto-detect framework** (toggle/checkbox)
   - **Base directory**
   - **Node version**

### Step 3: Disable Framework Auto-Detection

In the **Build settings** section:

1. **Framework dropdown**: Change from "Next.js" to **"None"** or **"Other"**
2. **Auto-detect framework**: Turn **OFF** (uncheck if it's checked)
3. **Build command**: Set to `npm run build:frontend`
4. **Publish directory**: Set to `dist`
5. Click **"Save"** or **"Update"**

## 🎯 Visual Guide

```
Netlify Dashboard
├── Your Site
│   ├── Site settings (⚙️)
│   │   ├── Build & deploy ← Click here
│   │   │   ├── Build status ← What you're looking at (OK to leave as "Active")
│   │   │   ├── Build settings ← **THIS IS WHAT YOU NEED!**
│   │   │   │   ├── Build command: [npm run build:frontend]
│   │   │   │   ├── Publish directory: [dist]
│   │   │   │   ├── Framework: [None] ← Change from "Next.js"
│   │   │   │   └── Auto-detect: [ ] ← Uncheck this
│   │   │   ├── Continuous Deployment
│   │   │   ├── Environment variables
│   │   │   └── Plugins
```

## ✅ Quick Checklist

- [ ] **Build status**: Set to "Active builds" (this is fine, leave it)
- [ ] **Build settings**: Click "Edit settings" here
- [ ] **Framework**: Change to "None" (not "Next.js")
- [ ] **Auto-detect framework**: Turn OFF
- [ ] **Build command**: Set to `npm run build:frontend`
- [ ] **Publish directory**: Set to `dist`
- [ ] **Save** changes

## 🐛 Can't Find Build Settings?

If you don't see "Build settings" section:

1. **Make sure you're in "Build & deploy"** section
2. **Scroll down** - it might be below "Build status"
3. **Look for "Build configuration"** or "Build options" (might be named differently)
4. **Look for a button** that says "Edit settings" or "Override"
5. **Check if you need to click "Build & deploy"** first in the left sidebar

## 💡 Key Difference

| Setting | What It Does | What You Need |
|---------|--------------|---------------|
| **Build status** | Controls if Netlify builds automatically | Leave as "Active builds" |
| **Build settings** | Controls HOW Netlify builds (command, directory, framework) | **EDIT THIS** to fix Next.js issue |

## 🎉 Summary

**Don't change "Build status"** - leave it as "Active builds".

**Go to "Build settings"** instead and:
1. Disable framework auto-detection
2. Set Framework to "None"
3. Set Build command to `npm run build:frontend`
4. Set Publish directory to `dist`

---

**Still can't find it?** Take a screenshot of what you see in the "Build & deploy" section and I can help you locate the exact settings!

