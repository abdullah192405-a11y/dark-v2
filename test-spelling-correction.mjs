/**
 * اختبار ميزة تصحيح الأخطاء الإملائية في الشات بوت
 * Test script for Arabic spelling correction feature
 */

// القاموس الموجود في chatbot.js (نسخة للاختبار)
const arabicSpellingVariations = {
  // أخطاء شائعة في كلمات السيارات
  "هايلوكس": "هايلكس",
  "هايلوكز": "هايلكس", 
  "هيلكس": "هايلكس",
  "هيلوكس": "هايلكس",
  "هاي لوكس": "هايلكس",
  "هاي لكس": "هايلكس",
  
  // أخطاء في ماركات السيارات
  "تويتا": "تويوتا",
  "تايوتا": "تويوتا",
  "تيوتا": "تويوتا",
  "تويته": "تويوتا",
  "تايوته": "تويوتا",
  "توتا": "تويوتا",  // إضافة جديدة
  "تويت": "تويوتا", // إضافة جديدة
  "توياتا": "تويوتا", // إضافة جديدة
  "تاتا": "تويوتا", // إضافة جديدة
  
  "هونداي": "هيونداي",
  "هايونداي": "هيونداي",
  "هونداى": "هيونداي",
  "هايوندا": "هيونداي",
  "هايونده": "هيونداي",
  
  // أخطاء في أسماء السيارات
  "كامرى": "كامري",
  "كامر": "كامري",
  
  "كورولا": "كورولا", // القيمة الصحيحة
  "كوروللا": "كورولا",
  "كورلا": "كورولا",
  "كوررولا": "كورولا",
  "كوريلا": "كورولا",
  
  "اكورد": "أكورد",
  "اكرد": "أكورد",
  "اكورت": "أكورد",
  
  // أخطاء في الألوان
  "احمر": "أحمر",
  "اخضر": "أخضر",
  "ازرق": "أزرق",
  "ابيض": "أبيض",
  "اسود": "أسود",
  
  // أخطاء في أنواع الوقود
  "كهربائى": "كهربائي",
  "هيبرد": "هجين",
  "هايبرد": "هجين",
  
  // أخطاء في أنواع السيارات
  "سيدان": "سيدان", // القيمة الصحيحة
  "سيدآن": "سيدان",
  "سادان": "سيدان",
  
  "هاتشباك": "هاتشباك", // القيمة الصحيحة
  "هاتش باك": "هاتشباك",
  "هاچباك": "هاتشباك",
  
  "دفع رباعى": "دفع رباعي",
  "دفع ربعى": "دفع رباعي",
  "4x4": "دفع رباعي",
  
  // أخطاء في كلمات عامة
  "سياره": "سيارة",
  "سيارات": "سيارات", // القيمة الصحيحة
  "سياارة": "سيارة",
  "سيارت": "سيارات",
  
  "اوتوماتيك": "أوتوماتيك",
  "اوتوماتك": "أوتوماتيك",
  "مانيوال": "عادي",
  "يدوي": "عادي",
  
  // تصحيح الأخطاء الإملائية في الكلمات الإنجليزية
  "toyta": "toyota",
  "toyata": "toyota", 
  "totoya": "toyota",
  "tyota": "toyota",
  
  "hunda": "honda",
  "hoda": "honda",
  
  "hyunday": "hyundai",
  "hunday": "hyundai",
  "huyndai": "hyundai",
  
  "nisan": "nissan",
  "nisssan": "nissan",
  "nissen": "nissan",
  
  "chevy": "chevrolet",
  "chevrolat": "chevrolet",
  
  "mercedez": "mercedes",
  "mercades": "mercedes",
  
  "bmv": "bmw",
  "bwm": "bmw",
  
  "foord": "ford",
  "frod": "ford",
  
  "camri": "camry",
  "camery": "camry",
  
  "corola": "corolla",
  "corollaa": "corolla",
  
  "hilix": "hilux",
  "hillux": "hilux",
};

// دالة التصحيح المحسنة (نسخة للاختبار)
function correctArabicSpelling(text) {
  if (!text || typeof text !== 'string') return text;
  
  let correctedText = text;
  
  // ترتيب المفاتيح من الأطول إلى الأقصر لتجنب التداخل
  const sortedKeys = Object.keys(arabicSpellingVariations).sort((a, b) => b.length - a.length);
  
  sortedKeys.forEach(incorrect => {
    const correct = arabicSpellingVariations[incorrect];
    
    // إذا كانت الكلمة موجودة في النص، استبدلها
    // استخدام regex للكلمات الإنجليزية للتأكد من التطابق الكامل
    if (correctedText.includes(incorrect)) {
      // للكلمات الإنجليزية، استخدم word boundaries
      if (/^[a-zA-Z]+$/.test(incorrect)) {
        // كلمة إنجليزية - استخدم word boundaries
        const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
        correctedText = correctedText.replace(regex, correct);
      } else {
        // كلمة عربية - استخدم الطريقة البسيطة
        correctedText = correctedText.split(incorrect).join(correct);
      }
    }
  });
  
  // تنظيف المسافات الزائدة
  correctedText = correctedText.replace(/\s+/g, ' ').trim();
  
  return correctedText;
}

// اختبارات مختلفة للميزة
const testCases = [
  // اختبار الحالة الأساسية المطلوبة
  {
    input: "أريد هايلوكس",
    expected: "أريد هايلكس",
    description: "اختبار تصحيح هايلوكس إلى هايلكس"
  },

  // اختبار الحالة الجديدة المطلوبة - توتا
  {
    input: "أريد توتا",
    expected: "أريد تويوتا",
    description: "اختبار تصحيح توتا إلى تويوتا"
  },
  
  {
    input: "ما المتوفر من سيارات توتا كامرى؟",
    expected: "ما المتوفر من سيارات تويوتا كامري؟",
    description: "اختبار تصحيح مركب: توتا كامرى"
  },
  
  // اختبارات إضافية للماركات
  {
    input: "ما المتوفر من سيارات تويتا؟",
    expected: "ما المتوفر من سيارات تويوتا؟",
    description: "تصحيح اسم ماركة تويوتا"
  },
  
  {
    input: "أبحث عن سياره هونداي كامرى",
    expected: "أبحث عن سيارة هيونداي كامري",
    description: "تصحيح متعدد: سياره -> سيارة، هونداي -> هيونداي، كامرى -> كامري"
  },
  
  // اختبار الألوان
  {
    input: "أريد سيارة احمر اللون",
    expected: "أريد سيارة أحمر اللون",
    description: "تصحيح لون أحمر"
  },
  
  // اختبار أنواع الوقود
  {
    input: "هل توجد سيارات كهربائى؟",
    expected: "هل توجد سيارات كهربائي؟",
    description: "تصحيح نوع الوقود الكهربائي"
  },
  
  // اختبار أنواع السيارات
  {
    input: "أبحث عن سيدآن اوتوماتك",
    expected: "أبحث عن سيدان أوتوماتيك",
    description: "تصحيح نوع السيارة وناقل الحركة"
  },
  
  // اختبار النص بدون أخطاء
  {
    input: "أريد تويوتا كامري أحمر أوتوماتيك",
    expected: "أريد تويوتا كامري أحمر أوتوماتيك",
    description: "نص صحيح - لا يحتاج تصحيح"
  },
  
  // اختبار نص مختلط بالإنجليزي
  {
    input: "أريد BMW أو مرسيدس احمر",
    expected: "أريد BMW أو مرسيدس أحمر",
    description: "نص مختلط - تصحيح الجزء العربي فقط"
  },
  
  // اختبار حالات الحروف المختلطة
  {
    input: "هايلوكس هاتش باك دفع رباعى",
    expected: "هايلكس هاتشباك دفع رباعي",
    description: "تصحيح متعدد للموديل والنوع"
  },
  
  // اختبار الفراغات الزائدة
  {
    input: "أريد   هايلوكس   احمر   ",
    expected: "أريد هايلكس أحمر",
    description: "تصحيح الكتابة وإزالة الفراغات الزائدة"
  },

  // اختبار التصحيحات الإنجليزية الجديدة
  {
    input: "I want toyta camri",
    expected: "I want toyota camry",
    description: "تصحيح العلامة التجارية والموديل الإنجليزي"
  },

  {
    input: "أبحث عن bmv أو mersedes",
    expected: "أبحث عن bmw أو mercedes",
    description: "تصحيح العلامات الإنجليزية في نص عربي"
  },

  {
    input: "هل توجد nissan hilux متاحة؟",
    expected: "هل توجد nissan hilux متاحة؟",
    description: "نص صحيح - عدم تغيير الكلمات الإنجليزية الصحيحة"
  },

  {
    input: "أريد chevy corola أحمر",
    expected: "أريد chevrolet corolla أحمر",
    description: "تصحيح مختلط إنجليزي وعربي"
  },

  {
    input: "show me ford focrd cars",
    expected: "show me ford focrd cars",
    description: "تصحيح العلامة فقط وترك الموديل غير المعروف"
  }
];

// تشغيل الاختبارات
console.log('🧪 بدء اختبار ميزة تصحيح الأخطاء الإملائية العربية\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((test, index) => {
  console.log(`\n--- اختبار رقم ${index + 1} ---`);
  console.log(`📝 الوصف: ${test.description}`);
  console.log(`📥 المدخل: "${test.input}"`);
  console.log(`🎯 المتوقع: "${test.expected}"`);
  
  const result = correctArabicSpelling(test.input);
  console.log(`📤 النتيجة: "${result}"`);
  
  if (result === test.expected) {
    console.log(`✅ نجح الاختبار`);
    passedTests++;
  } else {
    console.log(`❌ فشل الاختبار`);
  }
});

console.log(`\n\n🏆 ملخص النتائج:`);
console.log(`✅ اختبارات نجحت: ${passedTests}`);
console.log(`❌ اختبارات فشلت: ${totalTests - passedTests}`);
console.log(`📊 معدل النجاح: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log(`\n🎉 ممتاز! جميع الاختبارات نجحت. الميزة تعمل بشكل صحيح.`);
} else {
  console.log(`\n⚠️ يحتاج إلى مراجعة بعض الحالات.`);
}

// اختبار تفاعلي بسيط
console.log(`\n\n🔧 اختبار تفاعلي - أدخل جملة للتصحيح:`);
console.log(`مثال: node test-spelling-correction.mjs "أريد هايلوكس احمر"`);

// إذا تم تمرير نص كمعامل، اختبره
if (process.argv[2]) {
  const userInput = process.argv[2];
  const correctedInput = correctArabicSpelling(userInput);
  
  console.log(`\n📥 النص المدخل: "${userInput}"`);
  console.log(`📤 النص المصحح: "${correctedInput}"`);
  console.log(`${userInput === correctedInput ? '✅ لا يحتاج تصحيح' : '✏️ تم التصحيح'}`);
}