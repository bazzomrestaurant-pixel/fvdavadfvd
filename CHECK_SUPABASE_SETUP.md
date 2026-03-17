# 🔍 تشخيص مشاكل Supabase Storage

## المشكلة: تحميل الصور لا يعمل

استخدم هذا الدليل للتحقق من إعداداتك.

---

## ✅ الخطوة 1: تحقق من وجود الـ Bucket

في Supabase Dashboard:

1. اذهب إلى **Storage** من القائمة اليسار
2. يجب أن ترى bucket اسمه **`restaurant-gallery`**

### إذا لم تره:
**أنشئ Bucket جديد:**
```sql
SELECT * FROM storage.buckets WHERE name = 'restaurant-gallery';
```

إذا لم يظهر نتيجة، اتبع الخطوات:
- [ ] في Storage → اضغط **New Bucket**
- [ ] اسم الـ Bucket: `restaurant-gallery`
- [ ] اختر **Public** (حتى تكون الصور مرئية)
- [ ] اضغط **Create bucket**

---

## 🔐 الخطوة 2: تحقق من الصلاحيات (RLS)

في Supabase Dashboard:
1. اذهب إلى **Storage** → **restaurant-gallery**
2. اضغط على **Policies** (زر صغير على اليمين)
3. يجب أن ترى:

```
✅ Public Read Access
✅ Authenticated Write Access
```

### إذا لم تكن موجودة، أضفها:

**اضغط Add Policy → For authenticated users:**
```sql
CREATE POLICY "Enable upload for authenticated users"
ON storage.objects
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'restaurant-gallery');
```

---

## 🖼️ الخطوة 3: اختبر التحميل من Supabase

في Supabase Dashboard:
1. اذهب إلى **Storage** → **restaurant-gallery**
2. اضغط **Upload File**
3. اختر أي صورة وحملها

### إذا نجحت:
- [ ] الصورة ظهرت في القائمة
- [ ] يمكنك ترى رابط الصورة

### إذا فشلت:
- [ ] سجل رسالة الخطأ
- [ ] تأكد من أنك logged in كـ Admin

---

## 🧪 الخطوة 4: اختبر من التطبيق

في Admin Panel:
1. اذهب إلى `/admin/settings`
2. اضغط على تبويب **المعرض** (Gallery)
3. اضغط **إضافة صور**
4. اختر صورة صغيرة (أقل من 5MB)

### افتح Developer Tools (F12) وانظر إلى Console:
يجب أن ترى رسائل مثل:
```
🖼️ Uploading image: gallery/1707156800000_test.jpg
✅ Image uploaded to storage: gallery/1707156800000_test.jpg
✅ Public URL generated: https://...
✅ Gallery image saved to database: abc-123-def
```

---

## 🐛 رسائل الخطأ الشائعة والحلول

### ❌ "Upload failed: Duplicate"
**السبب:** اسم الملف موجود بالفعل
**الحل:** إعادة المحاولة (يستخدم timestamp فريد)

### ❌ "Failed to get public URL"
**السبب:** الـ Bucket غير موجود أو غير Public
**الحل:**
- تأكد من وجود `restaurant-gallery` bucket
- تأكد أنه **Public** وليس Private

### ❌ "Database insert failed"
**السبب:** الجدول `restaurant_gallery` قد لا يكون موجود
**الحل:** شغل SQL هذا:
```sql
SELECT * FROM restaurant_gallery LIMIT 1;
```
إذا أعطى خطأ "table does not exist"، شغل SUPABASE_SETTINGS_TABLE.sql

### ❌ "File must be an image"
**السبب:** الملف ليس صورة (مثل PDF أو TXT)
**الحل:** اختر صورة فقط (JPG, PNG, GIF, WebP)

### ❌ "Upload failed: Unauthorized"
**السبب:** مشكلة في الصلاحيات
**الحل:**
- تحقق من RLS Policies
- تأكد أنك logged in
- تأكد من الـ Anonymous Key صحيح

---

## 📋 Checklist سريعة

قبل أن تتواصل معي، تأكد من:

- [ ] Bucket `restaurant-gallery` موجود
- [ ] Bucket مضبوط على **Public**
- [ ] يمكنك تحميل صورة مباشرة في Supabase
- [ ] جدول `restaurant_gallery` موجود وفيه بيانات
- [ ] RLS Policies موجودة وسليمة
- [ ] فتحت F12 ورأيت رسائل التشخيص
- [ ] اختبرت مع صورة صغيرة (أقل من 5MB)

---

## 📞 إذا استمرت المشكلة

شارك معي:
1. **لقطة من Console (F12)** - الرسائل الحمراء كاملة
2. **رسالة الخطأ بالكامل** - copy-paste دقيق
3. **اسم البucket** - هل هو `restaurant-gallery` بالضبط؟
4. **نوع الصورة** - JPG? PNG?
5. **حجم الملف** - كم MB؟

---

**تم تحديث:** الكود الآن يعطيك معلومات أفضل
**النسخة:** 2.0
**الحالة:** ✅ جاهز للتشخيص
