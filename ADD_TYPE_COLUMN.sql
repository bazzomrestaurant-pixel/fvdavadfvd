-- إضافة العمود 'type' إلى جدول 'home_slides'
ALTER TABLE home_slides
ADD COLUMN type VARCHAR(50) DEFAULT 'normal';

-- إضافة comment للعمود لتوضيح الغرض
COMMENT ON COLUMN home_slides.type IS 'نوع الصورة: normal (صورة مع نصوص وزر) أو image-only (صورة فقط بدون نصوص)';
