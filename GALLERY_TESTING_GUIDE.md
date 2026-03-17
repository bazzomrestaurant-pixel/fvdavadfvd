# Gallery System - Testing Guide

## Pre-Testing Checklist

Before testing, ensure:
- [ ] Supabase bucket `restaurant-gallery` created
- [ ] Database table `restaurant_gallery` created
- [ ] RLS policies configured
- [ ] Storage permissions enabled
- [ ] Dev server running (`npm run dev`)
- [ ] Logged in as admin

---

## Test 1: Supabase Connectivity

### Objective
Verify connection to Supabase is working

### Steps
1. Go to Supabase dashboard
2. Navigate to **Storage**
3. Confirm you see `restaurant-gallery` bucket
4. Navigate to **SQL Editor**
5. Run this query:
```sql
SELECT COUNT(*) as image_count FROM public.restaurant_gallery;
```
6. Should return: `image_count: 0` (or higher if images exist)

### Expected Result
✅ Bucket visible in storage
✅ Table accessible via SQL
✅ No errors in console

### Troubleshooting
- ❌ Bucket not visible → Create it from dashboard
- ❌ SQL error → Run table creation script
- ❌ Table doesn't exist → Execute migration from SUPABASE_SETUP_GALLERY.md

---

## Test 2: Admin Login

### Objective
Verify admin authentication works

### Steps
1. Navigate to `http://localhost:3000/admin`
2. Should redirect to login page
3. Log in with admin credentials
4. Should redirect back to `/admin`

### Expected Result
✅ Login page displays
✅ Can authenticate successfully
✅ Admin dashboard loads

### Troubleshooting
- ❌ Can't login → Check Supabase auth setup
- ❌ Dashboard won't load → Check console for errors
- ❌ Redirects to home → Not authenticated as admin

---

## Test 3: Access Settings Page

### Objective
Verify settings page loads and displays gallery manager

### Steps
1. From admin dashboard, click **الإعدادات** (Settings)
2. Scroll down to find **معرض صور المطعم** section
3. Should see upload area and empty gallery grid

### Expected Result
✅ Settings page loads without errors
✅ Gallery Manager section visible
✅ Upload area displays with instructions
✅ No console errors

### Troubleshooting
- ❌ 404 error → Check that `/admin/settings` page exists
- ❌ Gallery Manager not showing → Verify import in settings/page.js
- ❌ Styling broken → Check CSS import in component

---

## Test 4: Upload Single Image

### Objective
Test single image upload functionality

### Steps
1. In Gallery Manager, click upload area
2. Select one image (PNG, JPG, or GIF)
3. Image should upload automatically
4. Wait for success message

### Expected Result
✅ Success toast notification appears
✅ Image appears in gallery grid below
✅ Image has delete button on hover
✅ No console errors

### Verification
1. Check Supabase Storage → restaurant-gallery
2. Should see a new file with name pattern: `gallery/[timestamp]_[filename]`

### Troubleshooting
- ❌ Upload fails silently → Check file size < 5MB
- ❌ "File type not supported" → Use PNG, JPG, GIF, or WebP
- ❌ Image not in storage → Check permissions, verify bucket is public
- ❌ Error in console → Check Supabase credentials in .env.local

---

## Test 5: Verify Database Record

### Objective
Confirm image metadata saved to database

### Steps
1. Go to Supabase SQL Editor
2. Run this query:
```sql
SELECT id, title, image_url, created_at 
FROM public.restaurant_gallery 
ORDER BY created_at DESC 
LIMIT 1;
```
3. Should return the image you just uploaded

### Expected Result
✅ One row returned
✅ Contains: id, title, image_url, created_at
✅ title = filename (or custom title if provided)
✅ image_url starts with https://

### Troubleshooting
- ❌ No rows returned → Image didn't save to DB
- ❌ image_url is NULL → Check upload function
- ❌ URL format wrong → Check storage bucket path

---

## Test 6: Upload Multiple Images

### Objective
Test bulk upload and display

### Steps
1. In Gallery Manager, click upload area
2. Select 5-10 images at once
3. All images should upload sequentially
4. Gallery grid should show all uploaded images

### Expected Result
✅ All images upload successfully
✅ Progress indicated by upload messages
✅ All images appear in grid
✅ Can see dates and icons on hover

---

## Test 7: Reorder Images

### Objective
Verify drag-and-drop reordering works

### Prerequisites
- [ ] At least 3 images uploaded

### Steps
1. In Gallery Manager, hover over an image
2. Click and hold the grip icon (≡)
3. Drag image up or down
4. Drop in new position
5. Order should update immediately

### Expected Result
✅ Can drag images
✅ Visual feedback during drag
✅ Images reorder in grid
✅ Reorder saves automatically
✅ Success toast appears

### Verification
1. Go to Supabase SQL Editor
2. Run:
```sql
SELECT id, title, sort_order 
FROM public.restaurant_gallery 
ORDER BY sort_order ASC;
```
3. Order should match gallery grid

### Troubleshooting
- ❌ Can't drag → Check if drag handler is clickable
- ❌ Reorder doesn't save → Check browser console
- ❌ Order resets after refresh → Database not updating

---

## Test 8: Delete Image

### Objective
Verify image deletion works

### Prerequisites
- [ ] At least 1 image uploaded

### Steps
1. Hover over any image in gallery
2. Click trash icon (🗑)
3. Confirm deletion in modal
4. Image should disappear from grid

### Expected Result
✅ Confirmation dialog appears
✅ Image removed from grid
✅ Success toast notification
✅ No console errors

### Verification
1. Check Supabase Storage → restaurant-gallery
2. File should be deleted
3. Check database:
```sql
SELECT COUNT(*) FROM public.restaurant_gallery;
```
4. Count should decrease by 1

### Troubleshooting
- ❌ Image stays after delete → Delete didn't work
- ❌ File still in storage → Storage deletion failed
- ❌ DB record still exists → DB deletion failed
- ❌ Error on delete → Check RLS policies

---

## Test 9: Home Page Gallery Display

### Objective
Verify gallery displays on public home page

### Prerequisites
- [ ] At least 3 images uploaded
- [ ] Settings page working

### Steps
1. Navigate to home page: `http://localhost:3000/`
2. Scroll down past featured dishes section
3. Should see **معرض صور المطعم** section
4. Gallery should display in 3-column responsive grid
5. Should show first 6 images (or all if < 6)

### Expected Result
✅ Gallery section visible
✅ Images load with proper spacing
✅ Responsive layout (1 column on mobile)
✅ Images have hover effects (zoom/highlight)
✅ No placeholder or broken images

### Troubleshooting
- ❌ Gallery not showing → Check HomeClient.js imports gallery
- ❌ No images displayed → Check if images in DB
- ❌ Styling broken → Check CSS classes in RestaurantGallery.jsx
- ❌ Images don't load → Check storage URLs work
- ❌ Layout broken → Check responsive grid classes

---

## Test 10: Lightbox Modal

### Objective
Verify lightbox image viewer works

### Prerequisites
- [ ] At least 3 images on home page

### Steps
1. On home page, click any image in gallery
2. Lightbox should open with:
   - Full-screen dark background
   - Large image display
   - Navigation arrows (left/right)
   - Close button (X)
   - Image counter (e.g., "1 / 5")
   - Thumbnail strip at bottom

### Expected Result
✅ Lightbox opens on image click
✅ Full image displays clearly
✅ Dark overlay background
✅ All controls visible and working

### Navigation Tests
1. Click right arrow → Next image loads
2. Click left arrow → Previous image loads
3. Click thumbnail → Jump to that image
4. Press Escape key → Lightbox closes
5. Click X button → Lightbox closes
6. Click background → Lightbox closes

### Expected Result
✅ All navigation methods work
✅ Images change smoothly
✅ Counter updates correctly
✅ No console errors

### Troubleshooting
- ❌ Lightbox doesn't open → Check click handler in RestaurantGallery.jsx
- ❌ Image not visible → Check z-index, CSS styling
- ❌ Navigation broken → Check arrow click handlers
- ❌ Escape key doesn't work → Check event listeners

---

## Test 11: Responsive Design

### Objective
Verify gallery works on all screen sizes

### Mobile (375px width)
1. Use Chrome DevTools device emulation (iPhone SE)
2. Gallery should show 1 column
3. Images should be full width
4. Touch/click should work

### Tablet (768px width)
1. DevTools tablet size (iPad)
2. Gallery should show 2 columns
3. Images properly sized
4. Spacing correct

### Desktop (1920px width)
1. Full browser window
2. Gallery should show 3 columns
3. Hover effects work
4. Layout centered

### Expected Result
✅ Layout adapts to screen size
✅ Images remain readable
✅ No horizontal scroll
✅ Touch interactions work on mobile
✅ Lightbox works on all sizes

### Troubleshooting
- ❌ Layout broken on mobile → Check responsive grid classes
- ❌ Images too small → Check width/height settings
- ❌ Text overlaps → Check padding/margins

---

## Test 12: Real-Time Updates

### Objective
Verify React Query cache updates

### Prerequisites
- [ ] 2 browser windows open
- [ ] One at `/admin/settings`, one at `/` home page

### Steps
1. In admin window, upload a new image
2. Wait for success message
3. Check home page → Should see new image (may need refresh)
4. Verify image appears without manual reload

### Expected Result
✅ New image visible after upload
✅ Updates within 10 seconds (cache staleness)
✅ Or immediately if page refreshed

### React Query Cache
```javascript
// Stale time: 10 minutes
staleTime: 1000 * 60 * 10

// To test immediate update:
// 1. Set staleTime to 0
// 2. Refresh page after upload
// 3. Image should appear immediately
```

---

## Test 13: Error Handling

### Objective
Verify app handles errors gracefully

### Test 13a: Invalid File Type
1. Try uploading a .txt file
2. Should show error message
3. File should not upload

### Test 13b: Oversized File
1. Try uploading file > 5MB
2. Should show error message
3. File should not upload

### Test 13c: Network Error
1. Disconnect internet
2. Try uploading
3. Should show error
4. Reconnect and retry

### Test 13d: Delete Confirmation
1. Click delete button
2. Cancel in dialog
3. Image should NOT be deleted
4. Click delete again
5. Confirm in dialog
6. Image should be deleted

### Expected Result
✅ All errors show user-friendly messages
✅ No white screen or crashes
✅ Can retry after error
✅ Confirmations prevent accidents

---

## Test 14: Performance

### Objective
Verify app performance

### Load Time Test
1. Open DevTools → Network tab
2. Load home page
3. Check:
   - Initial page load < 3 seconds
   - Gallery images load < 2 seconds
   - Lightbox opens < 500ms

### Large Dataset Test
1. Upload 50+ images
2. Navigate home page
3. Should load smoothly
4. Scrolling should be fluid

### Expected Result
✅ Page loads quickly
✅ Images don't slow site
✅ Smooth scrolling
✅ No lag in interactions

### Optimization
If slow:
- [ ] Compress images < 2MB
- [ ] Cache images 30+ minutes
- [ ] Consider pagination for 50+ images

---

## Test 15: Refresh & Persistence

### Objective
Verify data persists after refresh

### Steps
1. Upload 5 images
2. Note the gallery state
3. Refresh page (Ctrl+R)
4. Gallery should show same 5 images
5. Reload admin panel
6. Gallery Manager should show same images

### Expected Result
✅ Images persist after refresh
✅ Order maintained
✅ No data loss
✅ Database is source of truth

---

## Full Test Checklist

```
Supabase Setup:
[ ] Bucket created and public
[ ] Table exists in database
[ ] RLS policies enabled
[ ] Storage permissions set

Admin Panel:
[ ] Can login to admin
[ ] Settings page loads
[ ] Gallery Manager visible
[ ] Upload area displays

Upload/Delete:
[ ] Single file uploads
[ ] Multiple files upload
[ ] Delete confirmation works
[ ] Files deleted from storage
[ ] Records deleted from DB

Display:
[ ] Home page shows gallery
[ ] 3-column layout correct
[ ] Images load with correct URLs
[ ] Responsive on mobile/tablet
[ ] Lightbox opens on click

Navigation:
[ ] Arrow keys navigate images
[ ] Escape closes lightbox
[ ] Thumbnails jump to image
[ ] Close button works
[ ] Background click closes

Reordering:
[ ] Can drag images
[ ] Visual feedback during drag
[ ] Order persists after refresh
[ ] Database sort_order updated

Performance:
[ ] Page loads < 3 seconds
[ ] Images load < 2 seconds
[ ] No console errors
[ ] Smooth scrolling

Cross-Device:
[ ] Works on mobile
[ ] Works on tablet
[ ] Works on desktop
[ ] Touch interactions work
```

---

## Test Report Template

```markdown
## Gallery System Test Report

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]

### Results
- [ ] All tests passed
- [ ] Some tests failed
- [ ] Critical issues found

### Issues Found
1. [Issue description]
   - Severity: [Low/Medium/High]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

### Performance Metrics
- Page load time: ___ms
- Image load time: ___ms
- Lightbox open time: ___ms

### Notes
[Additional observations]

### Sign-off
Tested by: _________
Date: _________
Status: [PASS/FAIL]
```

---

## Common Test Failures & Solutions

| Test | Failure | Solution |
|------|---------|----------|
| Test 3 | Gallery Manager not showing | Check import in settings/page.js: `import GalleryManager from "./home/_components/GalleryManager"` |
| Test 4 | Upload fails | Check Supabase credentials in .env.local |
| Test 5 | No DB record | Verify table created with SQL script |
| Test 7 | Reorder doesn't save | Check React Query invalidation in mutation |
| Test 9 | Gallery not on home page | Verify RestaurantGallery imported in HomeClient.js |
| Test 10 | Lightbox doesn't open | Check onClick handler, ensure image is clickable |
| Test 13a | Accepts wrong file type | Check MIME type validation in uploadHandler |
| Test 14 | Slow performance | Compress images, clear browser cache |

---

## Test Automation (Optional)

For automated testing, you can write tests:

```javascript
// Example test with Jest
describe('Gallery System', () => {
  test('uploads image successfully', async () => {
    // Test upload
  });

  test('displays gallery on home page', async () => {
    // Test display
  });

  test('lightbox opens on image click', async () => {
    // Test lightbox
  });
});
```

---

**Total Test Time: ~30-45 minutes**
**Recommended Frequency: Before deployment and after changes**

Good luck with testing! 🚀
