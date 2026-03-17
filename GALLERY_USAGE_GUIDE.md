# Restaurant Gallery System - Complete Guide

## Overview

The restaurant gallery system allows admins to manage and display photos of the restaurant. Images are stored in Supabase Storage and managed through the admin panel.

---

## Features

✅ **Admin Panel**
- Upload multiple images at once
- Drag-and-drop to reorder images
- Delete images with confirmation
- View all images in a grid

✅ **Public Display**
- Interactive lightbox gallery on home page
- Responsive grid layout
- Smooth animations
- Image zoom effects
- Thumbnail navigation

✅ **Database Integration**
- Store gallery metadata in Supabase
- Organize images with titles
- Sort images by order

---

## Setup Instructions

### 1. Create Supabase Bucket and Table

Follow the instructions in `SUPABASE_SETUP_GALLERY.md`:

**Quick Steps:**
1. Go to Supabase Dashboard
2. **Storage** → Create new bucket → Name it `restaurant-gallery`
3. Run the SQL migration from the guide to create the table

### 2. Verify Configuration

The system uses:
- Bucket: `restaurant-gallery`
- Table: `restaurant_gallery`
- Services: `settings.service.js`

---

## Admin Usage

### Access Gallery Manager

1. Go to `/admin` dashboard
2. Click **الإعدادات** (Settings)
3. Scroll to **معرض صور المطعم** (Restaurant Gallery)

### Upload Images

**Method 1: Click Upload**
- Click the upload area
- Select multiple images (PNG, JPG, GIF)
- Images upload automatically

**Method 2: Drag & Drop**
- Drag image files to the upload area
- Drop to upload

### Organize Images

**Reorder:**
1. Hover over an image
2. Click the **grip icon** (≡)
3. Drag up or down to reorder
4. Order updates automatically

**Delete:**
1. Hover over image
2. Click the **trash icon** (🗑)
3. Confirm deletion

### View Gallery

- **Current Gallery**: Shown as grid below upload area
- **Count**: Display number of uploaded images
- **Dates**: Each image shows upload date

---

## Customer-Facing Gallery

### Location
The gallery appears on the home page (`/`) after the featured dishes section.

### Display Features
- **Grid**: Shows first 6 images in a 3-column responsive grid
- **"View All" Button**: Shown if more than 6 images
- **Lightbox**: Click any image to open full-screen viewer

### Lightbox Controls
- **Navigation**: Click left/right arrows or use keyboard arrows
- **Thumbnails**: See all images, click to jump
- **Close**: Click X button or press Escape
- **Info**: Current image title and position (e.g., "1 من 10")

---

## Technical Details

### Service Functions

**In `settings.service.js`:**

```javascript
// Get all gallery images
const images = await settingsService.getGalleryImages();

// Upload image
const image = await settingsService.uploadGalleryImage(file, title);

// Delete image
await settingsService.deleteGalleryImage(id, storagePath);

// Update order
await settingsService.updateGalleryOrder(images);
```

### Component Props

**RestaurantGallery.jsx** (No props required)
- Fetches images from database automatically
- Handles all state and interactions

**GalleryManager.js** (For Admin)
- Displays upload interface
- Shows gallery grid
- Handles drag-and-reorder

### Database Schema

```javascript
{
  id: 'uuid',
  image_url: 'https://...',      // Public URL
  storage_path: 'gallery/...',    // Storage path
  title: 'Image Title',
  description: null,
  sort_order: 0,                  // Lower = first
  created_at: 'timestamp',
  updated_at: 'timestamp'
}
```

---

## Customization

### Change Upload Area Text

Edit `GalleryManager.js` line ~67:
```javascript
<p className="text-white font-medium">
  اسحب الصور هنا أو انقر للاختيار  {/* Change this */}
</p>
```

### Modify Gallery Grid

Edit `RestaurantGallery.jsx`:

**Change columns:**
```javascript
// Current: 3 columns on large screens
lg:grid-cols-3

// Change to 4 columns:
lg:grid-cols-4
```

**Change image height:**
```javascript
// Current on mobile
h-32
// Try: h-40, h-48, h-56
```

### Adjust Lightbox Style

Edit lightbox styling in `RestaurantGallery.jsx` (line ~110):
```javascript
<div className="absolute inset-0 bg-black/95 z-50">
  {/* Increase/decrease black transparency: bg-black/95 */}
</div>
```

---

## Filtering & Sorting

### Show Only Specific Images

By category (future feature):
```javascript
// In settings.service.js, add category column to table
// Then filter by category in admin

const images = await settingsService.getGalleryImages('food');
```

### Sort by Upload Date

Currently: Sort by `sort_order` (manual)

To sort by date instead:
```javascript
// In settings.service.js, change order:
.order("created_at", { ascending: false })  // Newest first
```

---

## Troubleshooting

### Images Not Uploading

**Check:**
1. Bucket `restaurant-gallery` exists in Supabase Storage
2. Bucket is set to **Public**
3. File size < 5MB
4. Browser console shows no errors

**Fix:**
```bash
# Test storage bucket
1. Go to Supabase Dashboard
2. Storage → restaurant-gallery
3. Try uploading a test image
```

### Gallery Not Showing on Home Page

**Check:**
```javascript
// Verify RestaurantGallery is imported in HomeClient.js
import RestaurantGallery from "../app/_components/RestaurantGallery";

// Verify it's rendered
<RestaurantGallery />
```

**Debug:**
```sql
-- Check if images exist in database
SELECT COUNT(*) FROM public.restaurant_gallery;
```

### Images not loading in Lightbox

**Check URLs:**
1. Go to Supabase dashboard
2. Storage → restaurant-gallery → Copy URL
3. Paste in browser to verify image loads

**Fix permissions:**
```sql
-- Update bucket to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'restaurant-gallery';
```

### Reorder Not Working

**Check:**
1. All images have unique IDs
2. Database connection is working
3. Browser console shows no errors

**Reset order:**
```sql
-- Reset sort_order to default
UPDATE public.restaurant_gallery
SET sort_order = (ROW_NUMBER() OVER (ORDER BY created_at)) * 10;
```

---

## Performance Tips

### Image Optimization

1. **Compress images** before uploading (use TinyPNG, ImageMagick)
2. **Use appropriate formats:**
   - JPEG: Photos, high-detail images
   - PNG: Transparent backgrounds
   - WebP: Modern browsers

3. **Recommended sizes:**
   - Minimum: 400x300px
   - Recommended: 800x600px
   - Maximum: 2000x1500px

### Database Optimization

Indexes created automatically:
```sql
CREATE INDEX idx_restaurant_gallery_sort_order 
ON public.restaurant_gallery(sort_order);
```

### Caching

Rest 10 minutes cache on gallery images:
```javascript
staleTime: 1000 * 60 * 10,  // In GalleryManager.js
```

Increase if images don't change frequently:
```javascript
staleTime: 1000 * 60 * 60,  // 1 hour
```

---

## Future Enhancements

### Planned Features
- [ ] Image categories (Food, Ambiance, etc.)
- [ ] Image filters and effects
- [ ] Multi-language captions
- [ ] Comments/ratings on images
- [ ] Mobile app gallery

### Potential Additions
```javascript
// Add to restaurant_gallery table
- category: TEXT
- is_featured: BOOLEAN
- likes_count: INTEGER
- view_count: INTEGER
```

---

## Integration Checklist

- [x] Supabase bucket created
- [x] Database table created
- [x] RLS policies configured
- [x] Admin panel component built
- [x] Public display component built
- [x] Home page integration done
- [x] Services configured
- [ ] First images uploaded
- [ ] Gallery tested on home page
- [ ] Mobile responsive verified

---

## Quick Start

1. **Create Supabase setup** (5 minutes)
   - Run SQL from `SUPABASE_SETUP_GALLERY.md`

2. **Upload first images** (2 minutes)
   - Go to `/admin/settings`
   - Upload 5-10 images

3. **Verify display** (1 minute)
   - Visit home page `/`
   - Scroll to gallery section
   - Click image to test lightbox

**Total time: ~10 minutes**

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs in dashboard
3. Check browser console for errors
4. Verify database with SQL queries

---

## File References

**Configuration:**
- `.env.local` - Supabase credentials (should be set up already)

**Services:**
- `src/app/_services/settings.service.js` - Gallery API functions

**Components:**
- `src/app/admin/home/_components/GalleryManager.js` - Admin upload interface
- `src/app/_components/RestaurantGallery.jsx` - Public gallery display

**Pages:**
- `src/app/admin/settings/page.js` - Settings admin page
- `src/app/HomeClient.js` - Home page client component
- `src/app/page.js` - Home page server component

**Documentation:**
- `SUPABASE_SETUP_GALLERY.md` - Supabase setup SQL
- `GALLERY_USAGE_GUIDE.md` - This file
