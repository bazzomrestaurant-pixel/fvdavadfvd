# 📋 Setting up Restaurant Settings Database - دليل شامل

**الهدف:** إنشاء جدول `settings` في Supabase وتخزين كل إعدادات المطعم والتطبيق فيه.

---

## 📁 الملفات المطلوبة

- `SUPABASE_SETTINGS_TABLE.sql` - النسخة البسيطة (للمبتدئين)
- `SUPABASE_SETTINGS_COMPLETE.sql` - النسخة المتقدمة (مع إعدادات إضافية)
- `QUICK_SETTINGS_SETUP.md` - الخطوات السريعة
- `SUPABASE_SETTINGS_SETUP.md` - الشرح التفصيلي

---

## 🚀 البدء السريع (2 دقيقة)

### الخطوة 1: افتح Supabase

```
1. اذهب إلى https://app.supabase.com
2. اختر مشروعك
3. انقر على "SQL Editor" من القائمة الجانبية
4. انقر على "New Query" أو أيقونة "+"
```

### الخطوة 2: انسخ الكود

اختر أحد الملفات:
- **للمبتدئين:** `SUPABASE_SETTINGS_TABLE.sql`
- **للمتقدمين:** `SUPABASE_SETTINGS_COMPLETE.sql`

ثم:
```
1. افتح الملف
2. انسخ كل المحتوى (Ctrl+A ثم Ctrl+C)
3. الصق في SQL Editor (Ctrl+V)
```

### الخطوة 3: شغل الكود

```
اضغط "Run" أو اضغط Ctrl+Enter
```

### الخطوة 4: تحقق من النتائج

يجب أن تظهر نتيجع مشابهة:

```
settings_count
1
```

✅ **انتهى!** الآن تقدر تعدل الإعدادات من `/admin/settings`

---

## 📊 البيانات المخزنة

### 🏪 بيانات المطعم (Restaurant)
```json
{
  "name": "مطعم بزوم",              // اسم المطعم
  "phone": "0123456789",           // رقم الهاتف الرئيسي
  "whatsapp": "01000000000",       // رقم الواتس
  "email": "bazzomrestaurant@...", // البريد الإلكتروني
  "address": "دمياط , ميدان الساعة", // العنوان
  "openingTime": "12:00",          // وقت الفتح
  "closingTime": "23:00",          // وقت الإغلاق
  "deliveryFee": "0",              // رسوم التوصيل
  "minOrderValue": "0",            // الحد الأدنى للطلب
  "description": "...",            // وصف المطعم
  "logo": ""                       // رابط اللوجو
}
```

### ⚙️ إعدادات التطبيق (App)
```json
{
  "maintenanceMode": false,        // وضع الصيانة
  "enableOnlinePayment": true,     // تفعيل الدفع الإلكتروني
  "enableCashPayment": true,       // تفعيل الدفع النقدي
  "enableDelivery": true,          // تفعيل التوصيل
  "enableDineIn": true,            // تفعيل الطلب في المطعم
  "maxOrdersPerDay": "100",        // الحد الأقصى للطلبات يومياً
  "avgDeliveryTime": "30"          // متوسط وقت التوصيل بالدقائق
}
```

---

## 🔐 الأمان

### من يمكنه القراءة؟
- ✅ **الجميع** (بما فيهم الزوار)
  - يتمكنون من قراءة الإعدادات لعرض البيانات

### من يمكنه التعديل؟
- ✅ **المستخدمين المسجلين فقط** (الإداريين)
  - يتمكنون من تحديث الإعدادات من Admin Panel

---

## 💻 كيف تستخدم البيانات في الموقع

### قراءة الإعدادات

```javascript
// في أي مكان في الموقع
import { settingsService } from '@/app/_services/settings.service';

const settings = await settingsService.getSettings();

// الوصول للبيانات
const restaurantName = settings.restaurant.name;      // "مطعم بزوم"
const phone = settings.restaurant.phone;              // "0123456789"
const deliveryFee = settings.restaurant.deliveryFee;  // "0"
const maintenanceMode = settings.app.maintenanceMode; // false
```

### تحديث الإعدادات

```javascript
// في Admin Panel
await settingsService.updateSettings({
  restaurant: {
    ...settings.restaurant,
    phone: "01007576444" // الرقم الجديد
  },
  app: settings.app
});
```

---

## 🎯 استخدامات عملية

### 1. عرض بيانات الاتصال على Home Page
```javascript
const settings = await settingsService.getSettings();
const contactPhone = settings.restaurant.phone;
```

### 2. فحص وضع الصيانة
```javascript
const settings = await settingsService.getSettings();
if (settings.app.maintenanceMode) {
  // عرض صفحة الصيانة
}
```

### 3. حساب رسوم التوصيل
```javascript
const settings = await settingsService.getSettings();
const deliveryFee = parseFloat(settings.restaurant.deliveryFee);
const totalPrice = cartTotal + deliveryFee;
```

### 4. التحقق من التوصيل المتاح
```javascript
const settings = await settingsService.getSettings();
if (settings.app.enableDelivery) {
  // إظهار خيار التوصيل
}
```

---

## 🔧 الأوامر SQL المفيدة

### عرض كل الإعدادات
```sql
SELECT * FROM public.settings;
```

### عرض رقم الهاتف فقط
```sql
SELECT restaurant->>'phone' as phone FROM public.settings;
```

### تحديث يدوي لرقم الهاتف
```sql
UPDATE public.settings
SET restaurant = jsonb_set(restaurant, '{phone}', '"01007576444"')
WHERE id = 'UUID-OF-SETTINGS';
```

### حذف كل البيانات والبدء من جديد
```sql
DELETE FROM public.settings;
```

---

## 🐛 استكشاف الأخطاء

### ❌ الخطأ: "Relation settings does not exist"
**الحل:** الجدول لم يتم إنشاؤه بعد. شغل SQL Script كاملة.

### ❌ الخطأ: "Duplicate table"
**الحل:** الجدول موجود بالفعل. إما:
1. استخدم `SUPABASE_SETTINGS_COMPLETE.sql` (يتعامل مع الحالة)
2. أو حذف الجدول القديم:
```sql
DROP TABLE IF EXISTS public.settings CASCADE;
```

### ❌ البيانات لا تظهر
**الحل:** تحقق من الإدراج:
```sql
SELECT COUNT(*) FROM public.settings;
```

---

## 📈 الخطوات القادمة (بعد الإعداد)

1. ✅ افتح `/admin/settings`
2. ✅ عدّل بيانات المطعم (الهاتف، العنوان، إلخ)
3. ✅ عدّل إعدادات التطبيق
4. ✅ اضغط "حفظ الإعدادات"
5. ✅ البيانات تُحفظ في Supabase تلقائياً 🎉

---

## 📞 الدعم

إذا واجهت مشكلة:
1. تحقق من أن SQL Script شغلت بنجاح
2. تحقق من وجود الجدول: `SELECT COUNT(*) FROM public.settings;`
3. اقرأ رسالة الخطأ بعناية
4. اسأل في community أو documentation

---

## ✨ ملاحظات إضافية

- **JSONB:** نوع بيانات في PostgreSQL يسمح بتخزين بيانات JSON مع indexing و querying سريع
- **RLS:** Row Level Security - تحكم في من يمكنه رؤية وتعديل البيانات
- **Trigger:** دالة تلقائية تحدّث `updated_at` فور أي تعديل
- **Upsert:** عملية تدرج أو تحدّث حسب وجود البيانات

---

**تم الإعداد بنجاح! 🚀**

الآن اذهب إلى `/admin/settings` وابدأ في تعديل إعدادات المطعم!
