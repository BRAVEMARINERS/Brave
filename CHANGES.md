# سجل التغييرات - BraveMarines Update
**تاريخ التحديث:** مارس 2026

---

## الميزات الجديدة المضافة

### 1. قسم المنشورات الاجتماعية (Feed) - Backend حقيقي
**الملفات المعدّلة/المضافة:**
- `drizzle/schema.ts` — جداول جديدة: `posts`, `post_likes`, `post_comments`
- `server/db.ts` — دوال: `createPost`, `getPosts`, `likePost`, `addComment`, `getComments`
- `server/routers.ts` — routers: `feed.create`, `feed.list`, `feed.like`, `feed.comment`, `feed.deletePost`
- `client/src/pages/Feed.tsx` — إعادة كتابة كاملة مرتبطة بالـ Backend الحقيقي

**ما تم:**
- إنشاء منشورات نصية وصور
- إعجاب بالمنشورات (toggle like)
- تعليقات على المنشورات
- حذف المنشورات الخاصة
- عرض المنشورات مع pagination

---

### 2. نظام تعدد اللغات (i18n) - عربي/إنجليزي
**الملفات المضافة:**
- `client/src/i18n/ar.ts` — جميع النصوص بالعربية
- `client/src/i18n/en.ts` — جميع النصوص بالإنجليزية
- `client/src/i18n/index.tsx` — `I18nProvider` + `useI18n` hook
- `client/src/components/LanguageSwitcher.tsx` — زر تبديل اللغة
- `client/src/main.tsx` — تغليف التطبيق بـ `I18nProvider`

**ما تم:**
- دعم كامل للعربية (RTL) والإنجليزية (LTR)
- حفظ تفضيل اللغة في localStorage
- تبديل الاتجاه تلقائياً (dir="rtl/ltr")

---

### 3. الفلاتر المتقدمة للوظائف والبحارة
**الملفات المضافة:**
- `client/src/components/JobFilters.tsx` — فلاتر: بحث، رتبة، نوع سفينة، دولة، راتب
- `client/src/components/SeafarerFilters.tsx` — فلاتر: بحث، رتبة، دولة، حالة التوفر، خبرة

**ما تم:**
- فلاتر قابلة للطي/التوسع
- عرض tags للفلاتر النشطة مع إمكانية حذف كل فلتر بشكل مستقل
- عداد النتائج
- زر "مسح الكل"

**طريقة الاستخدام في الصفحات:**
```tsx
import JobFilters, { JobFilterValues } from "@/components/JobFilters";
const [filters, setFilters] = useState<JobFilterValues>({});
// ثم مرر filters إلى trpc query
```

---

### 4. تتبع صلاحية الشهادات
**الملفات المضافة:**
- `client/src/components/DocumentExpiryTracker.tsx`
- `drizzle/schema.ts` — عمود `expiryDate` في جدول `seafarerDocuments`
- `server/routers.ts` — `documents.updateExpiry`

**ما تم:**
- تصنيف الوثائق: منتهية / حرجة (30 يوم) / تحذير (90 يوم) / سارية
- إحصائيات بصرية ملونة
- تنبيه بانر للوثائق الحرجة
- تعديل تاريخ الانتهاء مباشرة من الواجهة

**طريقة الاستخدام:**
```tsx
import DocumentExpiryTracker from "@/components/DocumentExpiryTracker";
<DocumentExpiryTracker documents={seafarerDocs} onRefresh={refetch} />
```

---

### 5. منشئ السيرة الذاتية (CV Builder)
**الملفات المضافة:**
- `server/cvGenerator.ts` — مولّد HTML احترافي للـ CV
- `server/_core/index.ts` — endpoint: `GET /api/cv/generate?lang=ar|en`
- `client/src/components/CVBuilder.tsx` — مكون الواجهة

**ما تم:**
- توليد CV HTML احترافي بالعربية أو الإنجليزية
- يشمل: معلومات شخصية، رتبة، خبرة، نبذة، أنواع السفن، الشهادات
- معاينة في تبويب جديد أو تحميل مباشر
- قابل للطباعة كـ PDF من المتصفح

**طريقة الاستخدام:**
```tsx
import CVBuilder from "@/components/CVBuilder";
// أضفه في Dashboard البحّار
<CVBuilder />
```

---

### 6. إدارة طاقم السفينة (Crew Management)
**الملفات المضافة:**
- `client/src/pages/CrewManagement.tsx` — صفحة كاملة
- `drizzle/schema.ts` — جدول `crewAssignments`
- `server/db.ts` — دوال: `assignCrew`, `getCrewByCompany`, `updateCrewStatus`, `removeCrew`
- `server/routers.ts` — routers: `crew.assign`, `crew.getByCompany`, `crew.update`, `crew.remove`
- `client/src/App.tsx` — route: `/crew`

**ما تم:**
- تعيين بحارة لسفن محددة مع رتبة وتواريخ
- تتبع حالة التعيين: نشط / منتهي / ملغي
- إحصائيات سريعة
- فلترة حسب الحالة

---

### 7. لوحة ATS Kanban للشركات
**الملفات المضافة:**
- `client/src/pages/ATSBoard.tsx` — لوحة Kanban كاملة
- `drizzle/schema.ts` — جدول `applicationNotes`
- `server/db.ts` — دوال: `getCompanyApplications`, `updateApplicationStatus`, `addApplicationNote`, `getApplicationNotes`
- `server/routers.ts` — routers: `ats.getCompanyApplications`, `ats.updateStatus`, `ats.addNote`, `ats.getNotes`
- `client/src/App.tsx` — route: `/ats`

**ما تم:**
- لوحة Kanban بـ 6 أعمدة: جديد → مراجعة → مختار → مقابلة → مقبول → مرفوض
- تفاصيل كل طلب في dialog
- إضافة ملاحظات داخلية على كل طلب
- فلترة حسب الوظيفة

---

### 8. Rate Limiting وحماية Spam
**الملفات المضافة:**
- `server/rateLimit.ts` — middleware كامل

**ما تم:**
- Rate Limiters جاهزة: `generalLimiter`, `authLimiter`, `postLimiter`, `applicationLimiter`, `cvLimiter`
- كشف Spam في المحتوى (patterns + URL count)
- Security Headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, إلخ
- تطبيق تلقائي على جميع `/api` routes

---

### 9. تحسينات SEO
**الملفات المضافة:**
- `client/src/components/SEOHead.tsx`

**ما تم:**
- إدارة ديناميكية لـ `<title>`, `<meta>`, Open Graph, Twitter Cards
- Structured Data (JSON-LD) لـ Schema.org
- Canonical URLs
- دعم ثنائي اللغة للـ meta tags
- إعدادات جاهزة لكل صفحة في `SEO_CONFIGS`

**طريقة الاستخدام:**
```tsx
import SEOHead, { SEO_CONFIGS } from "@/components/SEOHead";
const { lang } = useI18n();
<SEOHead {...SEO_CONFIGS.jobs(lang)} />
```

---

## ملخص الملفات الجديدة

| الملف | النوع | الوصف |
|-------|-------|-------|
| `client/src/i18n/ar.ts` | جديد | ترجمة عربية |
| `client/src/i18n/en.ts` | جديد | ترجمة إنجليزية |
| `client/src/i18n/index.tsx` | جديد | I18n Provider |
| `client/src/components/LanguageSwitcher.tsx` | جديد | زر تبديل اللغة |
| `client/src/components/JobFilters.tsx` | جديد | فلاتر الوظائف |
| `client/src/components/SeafarerFilters.tsx` | جديد | فلاتر البحارة |
| `client/src/components/DocumentExpiryTracker.tsx` | جديد | تتبع الشهادات |
| `client/src/components/CVBuilder.tsx` | جديد | منشئ السيرة الذاتية |
| `client/src/components/SEOHead.tsx` | جديد | تحسين SEO |
| `client/src/pages/Feed.tsx` | معدّل | Feed حقيقي |
| `client/src/pages/CrewManagement.tsx` | جديد | إدارة الطاقم |
| `client/src/pages/ATSBoard.tsx` | جديد | لوحة ATS |
| `client/src/App.tsx` | معدّل | routes جديدة |
| `client/src/main.tsx` | معدّل | I18nProvider |
| `server/cvGenerator.ts` | جديد | مولّد CV |
| `server/rateLimit.ts` | جديد | Rate Limiting |
| `server/db.ts` | معدّل | دوال جديدة |
| `server/routers.ts` | معدّل | API endpoints |
| `server/_core/index.ts` | معدّل | CV endpoint + security |
| `drizzle/schema.ts` | معدّل | جداول جديدة |

---

## خطوات الدمج مع المشروع الأصلي

1. **قاعدة البيانات:** شغّل `pnpm db:push` بعد تحديث `schema.ts`
2. **الـ i18n:** تأكد من تغليف App بـ `I18nProvider` في `main.tsx`
3. **الـ routes:** أضف `/crew` و `/ats` إلى Navbar للشركات
4. **الـ CV Builder:** أضف `<CVBuilder />` في Dashboard البحّار
5. **الـ Filters:** استبدل حقل البحث الحالي في Jobs/Seafarers بالمكونات الجديدة
6. **الـ SEO:** أضف `<SEOHead>` في أول كل صفحة
