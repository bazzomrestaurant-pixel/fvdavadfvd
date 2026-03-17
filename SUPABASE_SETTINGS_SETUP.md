# إنشاء جدول Settings في Supabase - الخطوات الكاملة

## 🎯 الهدف
إنشاء جدول `settings` في Supabase يحتوي على إعدادات المطعم والتطبيق مع البيانات الحالية من الموقع.

---

## 📋 البيانات التي سيتم إدراجها

### بيانات المطعم (Restaurant):
```json
{
  "name": "مطعم بزوم",
  "phone": "0123456789",
  "address": "دمياط , ميدان الساعة",
  "email": "bazzomrestaurant@gmail.com",
  "openingTime": "12:00",
  "closingTime": "23:00",
  "deliveryFee": "0",
  "minOrderValue": "0",
  "description": "مطعم بزوم - تقدم أشهى الوجبات",
  "logo": ""
}
```

### إعدادات التطبيق (App):
```json
{
  "maintenanceMode": false,
  "enableOnlinePayment": true,
  "enableCashPayment": true,
  "enableDelivery": true,
  "enableDineIn": true,
  "maxOrdersPerDay": "100",
  "avgDeliveryTime": "30"
}
```

---

## ⚙️ الخطوات

### الخطوة 1️⃣: فتح SQL Editor في Supabase

1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **SQL Editor** من القائمة الجانبية
4. اضغط على **New Query** أو **+** لإنشاء query جديدة

---

### الخطوة 2️⃣: نسخ SQL Script

1. افتح الملف: `SUPABASE_SETTINGS_TABLE.sql` من project root
2. انسخ **كل المحتوى**
3. الصق في Supabase SQL Editor

```sql
-- Script كامل موجود في SUPABASE_SETTINGS_TABLE.sql
```

---

### الخطوة 3️⃣: تنفيذ Script

1. بعد نسخ الكود في SQL Editor
2. اضغط **Run** (أو Ctrl+Enter)
3. انتظر حتى ينتهي التنفيذ

---

### الخطوة 4️⃣: التحقق من النتائج

بعد التنفيذ الناجح، ستظهر النتائج في الجزء السفلي:

#### النتيجة 1: عدد الإعدادات
```
settings_count
1
```

#### النتيجة 2: بيانات الإعدادات
```
id          | restaurant_name | phone       | email                        | address
------------|-----------------|-------------|------------------------------|-------------------
UUID        | "مطعم بزوم"     | "01234...  | "bazzomrestaurant@gm..."   | "دمياط , ميدان الس..."
```

---

## 🔍 ماذا يفعل Script؟

### 1. إنشاء الجدول
- ✅ تنشئ جدول `settings` مع الأعمدة:
  - `id` - معرف فريد (UUID)
  - `restaurant` - إعدادات المطعم (JSON)
  - `app` - إعدادات التطبيق (JSON)
  - `created_at` - وقت الإنشاء
  - `updated_at` - وقت آخر تحديث

### 2. إدراج البيانات
- ✅ يدرج البيانات الافتراضية من homeData.js

### 3. إضافة Trigger
- ✅ يضيف trigger تلقائي لتحديث `updated_at` عند أي تعديل

### 4. تفعيل الحماية (RLS)
- ✅ الجميع يمكنهم قراءة الإعدادات
- ✅ فقط المستخدمين المسجلين يمكنهم التعديل

---

## 🚀 بعد التنفيذ

### تحديث البيانات:

في صفحة Settings اكتب:

```javascript
// تحديث رقم الهاتف
await settingsService.updateSettings({
  restaurant: {
    ...currentSettings.restaurant,
    phone: "01007576444" // الرقم الجديد
  },
  app: currentSettings.app
});
```

### قراءة البيانات:

```javascript
const settings = await settingsService.getSettings();
console.log(settings.restaurant.phone); // "0123456789"
console.log(settings.app.maintenanceMode); // false
```

---

## 🔒 الأمان (RLS Policies)

**من يمكنه القراءة؟**
- ✅ الجميع (بما فيهم الضيوف)

**من يمكنه التعديل؟**
- ✅ فقط المستخدمين المسجلين (المسؤولين)

---

## ⚠️ في حالة الخطأ

### إذا ظهر خطأ "table already exists"
مسح الجدول القديم أولاً:
```sql
DROP TABLE IF EXISTS public.settings CASCADE;
```
ثم شغل Script من جديد.

### إذا لم يتم إدراج البيانات
شيك في SQL Editor:
```sql
SELECT * FROM public.settings;
```

---

## 📱 التعديل عبر Admin Panel

الآن في `/admin/settings`:

1. **اقرأ الإعدادات الحالية** من DataFrame
2. **عدّل البيانات** المطلوبة
3. **اضغط حفظ**
4. **البيانات تُحفظ في Supabase تلقائياً** ✅

---

## 🎓 معلومات تقنية

### هيكل JSON في SQL
```sql
-- الوصول للحقول
SELECT restaurant->>'name' as name FROM settings;
SELECT app->'maintenanceMode' as maintenance FROM settings;

-- التحديث
UPDATE settings 
SET restaurant = jsonb_set(restaurant, '{phone}', '"01007576444"')
WHERE id = 'UUID-HERE';
```

### الفهارس (Indexes)
- الجدول مفهرس على `id` للأداء الأفضل

---

## ✅ قائمة التحقق

- [ ] فتحت Supabase Dashboard
- [ ] نسخت Script كامل من SUPABASE_SETTINGS_TABLE.sql
- [ ] الصقت في SQL Editor
- [ ] شغلت Script (اضغط Run)
- [ ] تحققت من البيانات (ظهرت النتائج)
- [ ] ذهبت إلى `/admin/settings` واختبرت التعديل
- [ ] الدالة `getSettings()` تعمل ✅

---

## 💡 ملاحظات مهمة

1. **البيانات الحالية محفوظة:**
   - أرقام الهاتف: `0123456789` و `01000000000`
   - البريد: `bazzomrestaurant@gmail.com`
   - العنوان: `دمياط , ميدان الساعة`
   - ساعات العمل: `12:00 - 23:00`

2. **يمكنك تغيير البيانات لاحقاً:**
   - إما عبر Admin Panel
   - أو عبر Supabase Dashboard مباشرة

3. **الـ RLS مفعل:**
   - الموقع العام يقدر يقرأ الإعدادات
   - فقط الإداريين يقدرو يعدلو

---

## 🆘 الدعم

إذا واجهت مشكلة:

1. **تحقق من الأخطاء** في SQL Editor
2. **انسخ رسالة الخطأ** بالكامل
3. **جرب قراءة الجدول:**
   ```sql
   SELECT * FROM public.settings LIMIT 1;
   ```

---

**تم التحضير بنجاح! ✅**

الآن يمكنك تعديل الإعدادات من `/admin/settings` والبيانات ستُحفظ في Supabase تلقائياً.
