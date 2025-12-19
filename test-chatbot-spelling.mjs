/**
 * مثال لاختبار ميزة تصحيح الأخطاء الإملائية مع ChatBot
 * Test example for Arabic spelling correction with ChatBot
 */

import { getChatbotResponse } from './src/actions/chatbot.js';

async function testChatbotWithSpellingCorrection() {
  console.log('🤖 اختبار ChatBot مع ميزة تصحيح الأخطاء الإملائية\n');

  // أمثلة لرسائل بأخطاء إملائية
  const testMessages = [
    "أريد هايلوكس",
    "ما المتوفر من سيارات تويتا؟", 
    "أبحث عن سياره هونداي احمر",
    "هل توجد سيارات كهربائى؟",
    "أريد سيدآن اوتوماتك دفع رباعى",
    "كم سعر كامرى 2024؟"
  ];

  console.log('📝 الرسائل التي سيتم اختبارها:');
  testMessages.forEach((msg, index) => {
    console.log(`${index + 1}. "${msg}"`);
  });

  console.log('\n🔍 النتائج:\n');

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`--- اختبار ${i + 1} ---`);
    console.log(`📥 الرسالة: "${message}"`);
    
    try {
      const response = await getChatbotResponse(message);
      
      if (response.success) {
        console.log(`✅ الرد: ${response.message.substring(0, 100)}...`);
        console.log(`🚗 سيارات موجودة: ${response.carsFound}`);
        console.log(`📊 سيارات معروضة: ${response.cars ? response.cars.length : 0}`);
      } else {
        console.log(`❌ خطأ: ${response.message}`);
      }
    } catch (error) {
      console.log(`💥 خطأ في الاختبار: ${error.message}`);
    }
    
    console.log(''); // سطر فارغ
  }
}

// تشغيل الاختبار إذا تم تشغيل الملف مباشرة
if (process.argv[1].includes('test-chatbot-spelling.mjs')) {
  testChatbotWithSpellingCorrection()
    .then(() => {
      console.log('🏁 انتهى الاختبار');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 خطأ في تشغيل الاختبار:', error);
      process.exit(1);
    });
}