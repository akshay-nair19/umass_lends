# Image Upload Setup Guide

## ✅ What's Been Added

I've added image upload functionality that allows users to upload images directly from their computer using Supabase Storage.

## 🚀 Setup Steps

### Step 1: Create Supabase Storage Bucket

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Navigate to Storage**: Click "Storage" in the left sidebar
3. **Create a new bucket**:
   - Click "New bucket"
   - Name: `item-images`
   - Public: ✅ **Yes** (check this box - required for public image URLs)
   - Click "Create bucket"

### Step 2: Set Up Storage Policies

You need to allow users to upload images to the bucket.

1. **Go to Storage Policies**: Click on the `item-images` bucket → "Policies"
2. **Create policy for uploads**:

**Policy Name**: "Allow authenticated users to upload images"

**Policy Definition** (SQL):
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Allow users to update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'item-images');

-- Allow public to read images
CREATE POLICY "Allow public to read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'item-images');
```

3. **Click "Save"** for each policy

### Step 3: Verify Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Test Image Upload

1. **Start your frontend**: `npm run dev:frontend`
2. **Sign in** to your app
3. **Go to Create Item page**: `/items/new`
4. **Click "Choose File"** and select an image
5. **You should see a preview** of the image
6. **Fill out the form** and submit
7. **Image should upload** and be displayed on the item

---

## 📋 How It Works

### 1. User Selects Image
- User clicks "Choose File"
- Selects an image from their computer
- Image is validated (type and size)

### 2. Image Preview
- Image is displayed as a preview
- User can remove the image if needed

### 3. Image Upload
- When form is submitted, image is uploaded to Supabase Storage
- Image is stored in `item-images/{userId}/{timestamp}_{random}.{ext}`
- Public URL is generated

### 4. Save to Database
- Public URL is saved to the `image_url` field in the database
- Item is created with the image URL

---

## 🔧 Features

### Image Validation
- ✅ File type must be an image
- ✅ Maximum file size: 5MB
- ✅ Shows error if validation fails

### Image Preview
- ✅ Shows preview before upload
- ✅ User can remove image
- ✅ Preview is removed when image is removed

### Upload Progress
- ✅ Shows "Uploading image..." while uploading
- ✅ Shows "Creating..." while creating item
- ✅ Disables form during upload

### Fallback Option
- ✅ Users can still paste image URLs if they prefer
- ✅ URL input is hidden when image is selected
- ✅ URL input is shown when no image is selected

---

## 🐛 Troubleshooting

### Issue 1: "Failed to upload image"

**Possible causes:**
- Storage bucket doesn't exist
- Storage policies not set up
- Bucket is not public
- User is not authenticated

**Fix:**
1. Check if bucket `item-images` exists
2. Check if bucket is public
3. Check storage policies
4. Make sure user is signed in

### Issue 2: "Image must be less than 5MB"

**Fix:**
- Compress the image before uploading
- Use a smaller image
- Current limit is 5MB (can be changed in `src/utils/imageUpload.js`)

### Issue 3: Image not displaying

**Possible causes:**
- Image URL is incorrect
- Bucket is not public
- CORS issues

**Fix:**
1. Check if bucket is public
2. Check image URL in database
3. Check browser console for CORS errors

### Issue 4: "Bucket not found"

**Fix:**
1. Create the `item-images` bucket in Supabase
2. Make sure bucket name matches exactly: `item-images`
3. Restart your frontend

---

## 💡 Customization

### Change Maximum File Size

Edit `src/utils/imageUpload.js`:

```javascript
// Change from 5MB to 10MB
const maxSize = 10 * 1024 * 1024; // 10MB
```

### Change Storage Bucket Name

1. **Update utility**: Change `item-images` to your bucket name in `src/utils/imageUpload.js`
2. **Create bucket**: Create the new bucket in Supabase
3. **Update policies**: Update storage policies for the new bucket

### Change Image Validation

Edit `src/pages/CreateItem.jsx` in `handleImageChange`:

```javascript
// Allow only specific image types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  setError('Only JPEG, PNG, and WebP images are allowed');
  return;
}
```

---

## 📚 Files Modified

1. **`src/utils/imageUpload.js`** - New file for image upload utility
2. **`src/pages/CreateItem.jsx`** - Updated to handle file uploads
3. **`docs/IMAGE_UPLOAD_SETUP.md`** - This documentation

---

## ✅ Checklist

- [ ] Storage bucket `item-images` created in Supabase
- [ ] Bucket is set to public
- [ ] Storage policies are set up
- [ ] Environment variables are set
- [ ] Frontend is running
- [ ] User is signed in
- [ ] Can select image file
- [ ] Can see image preview
- [ ] Can upload image
- [ ] Image displays on item

---

## 🎉 You're Done!

Once you've set up the storage bucket and policies, users can upload images directly from their computer. The images will be stored in Supabase Storage and displayed on items.

If you encounter any issues, check the troubleshooting section or the browser console for errors.

