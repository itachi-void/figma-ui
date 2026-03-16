import { test, expect } from '@playwright/test';

test('RecycleHub Diagnostic Scanner', async ({ page }) => {
  console.log('\n🚀 --- بدء الفحص الشامل لمشروع RecycleHub --- 🚀\n');

  // 1. الدخول للموقع
  try {
    console.log('[1] جاري الدخول إلى صفحة الخريطة...');
    await page.goto('https://figma-ui-dusky.vercel.app/dashboard/fleet-map', { timeout: 15000 });
    console.log('✅ نجاح: تم تحميل صفحة الخريطة.');
  } catch (error) {
    console.log('❌ فشل: لم أتمكن من فتح الموقع. (تأكد من الرابط أو سرعة الإنترنت)');
    return; // لو الموقع مفتحش، نوقف الاختبار
  }

  // 2. اختبار زر Optimize All Routes
  try {
    console.log('\n[2] جاري فحص زر (تحسين المسارات - Optimize All Routes)...');
    const optimizeBtn = page.getByRole('button', { name: /Optimize/i });
    
    // التأكد من ظهوره
    await optimizeBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ نجاح: الزر موجود وظاهر على الشاشة.');

    // الضغط عليه والتأكد من حماية الـ UI (Disabled state)
    await optimizeBtn.click();
    console.log('🔘 تم الضغط على الزر.');
    
    // ننتظر جزء من الثانية لنرى رد فعل الواجهة
    await page.waitForTimeout(500); 
    const isDisabled = await optimizeBtn.isDisabled();
    
    if (isDisabled) {
      console.log('🌟 ممتاز (UX): الزر أصبح غير مفعل بعد الضغط لمنع التكرار.');
    } else {
      console.log('⚠️ تحذير (UX): الزر لم يتعطل بعد الضغط! المستخدم قد يضغط مرتين ويرهق السيرفر.');
    }
  } catch (error) {
    console.log('❌ فشل: لم أتمكن من إيجاد زر Optimize أو التفاعل معه.');
  }

  // 3. اختبار زر Assign New Driver
  try {
    console.log('\n[3] جاري فحص زر (تعيين سائق - Assign New Driver)...');
    const assignBtn = page.getByRole('button', { name: /Assign/i });
    await assignBtn.click();
    console.log('🔘 تم الضغط على زر تعيين سائق.');
    
    // البحث عن أي نافذة منبثقة (Modal/Dialog) تظهر بعد الضغط
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 4000 });
    console.log('✅ نجاح: ظهرت النافذة المنبثقة لاختيار السائق بنجاح.');
  } catch (error) {
    console.log('⚠️ تحذير: ضغطت على زر تعيين سائق ولكن لم تظهر أي نافذة منبثقة (Modal) خلال 4 ثوانٍ.');
  }

  console.log('\n🏁 --- انتهى الفحص التشخيصي! انسخ هذا التقرير وابعته للذكاء الاصطناعي --- 🏁\n');
});