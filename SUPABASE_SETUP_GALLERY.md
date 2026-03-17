# Supabase Setup Guide - Restaurant Gallery

## Step 1: Create Storage Bucket

### Via Supabase Dashboard:
1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name it: `restaurant-gallery`
4. Click **Create bucket**

### Via SQL (Alternative):
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-gallery', 'restaurant-gallery', true);
```

---

## Step 2: Create Gallery Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create restaurant_gallery table
CREATE TABLE IF NOT EXISTS public.restaurant_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_restaurant_gallery_sort_order 
ON public.restaurant_gallery(sort_order);

-- Enable realtime
ALTER TABLE public.restaurant_gallery REPLICA IDENTITY FULL;
```

---

## Step 3: Set Up RLS (Row Level Security)

Run this SQL to allow public read access and authenticated write access:

```sql
-- Enable RLS
ALTER TABLE public.restaurant_gallery ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access" 
  ON public.restaurant_gallery
  FOR SELECT
  USING (true);

-- Policy for authenticated users to manage gallery
CREATE POLICY "Allow authenticated users to manage gallery"
  ON public.restaurant_gallery
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Step 4: Set Storage Permissions

Run this SQL to set storage policies:

```sql
-- Allow public read access to gallery bucket
CREATE POLICY "Allow public read access to gallery"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'restaurant-gallery');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated users to upload to gallery"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-gallery' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated users to delete gallery images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'restaurant-gallery'
    AND auth.role() = 'authenticated'
  );
```

---

## Step 5: Verify Setup

1. Check **Storage** → **restaurant-gallery** bucket exists and is public
2. Check **SQL Editor** → Run query to verify table:
   ```sql
   SELECT * FROM public.restaurant_gallery;
   ```
3. Test upload via admin panel: `/admin/settings`

---

## Database Schema Reference

### restaurant_gallery table:
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| image_url | TEXT | Public URL of the image |
| storage_path | TEXT | Internal path in Supabase Storage |
| title | TEXT | Image title |
| description | TEXT | Optional description |
| sort_order | INTEGER | Order in gallery (lower = first) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## Testing

### Upload via Admin Panel:
1. Go to `/admin/settings`
2. Scroll to "معرض صور المطعم" (Restaurant Gallery)
3. Click to upload images
4. Images should appear immediately

### View on Home Page:
1. Go to home page `/`
2. Scroll to "معرض المطعم" section
3. Gallery should display uploaded images

---

## Troubleshooting

### Images not uploading?
- Check bucket `restaurant-gallery` exists in Storage
- Verify RLS policies are correct
- Check browser console for errors

### Gallery not showing on home page?
- Verify images are in database:
  ```sql
  SELECT COUNT(*) FROM public.restaurant_gallery;
  ```
- Check image URLs are valid (click them in browser)

### Bucket not public?
- Go to Storage → restaurant-gallery
- Click three dots menu
- Click "Edit bucket privacy"
- Toggle to "Public"

---

## File Structure Reference

### Services:
- `src/app/_services/settings.service.js` - Gallery functions

### Components:
- `src/app/admin/home/_components/GalleryManager.js` - Admin gallery editor
- `src/app/_components/RestaurantGallery.jsx` - Public gallery display

### Pages:
- `src/app/admin/settings/page.js` - Settings page with gallery manager
- `src/app/page.js` - Home page (add RestaurantGallery component)

---

## Next Steps

1. **Update Home Page** - Import and use RestaurantGallery component:
   ```javascript
   import RestaurantGallery from './_components/RestaurantGallery';
   
   // In the home page JSX:
   <RestaurantGallery />
   ```

2. **Upload First Images** - Via admin panel at `/admin/settings`

3. **Customize** - Edit gallery styling in components as needed
