// Quick test to verify Arabic car name matching

const testQueries = [
  "اودي",
  "أودي", 
  "Audi",
  "AUDI",
  "أريد سيارة اودي",
  "هل لديكم سيارات اودي",
  "show me audi cars",
  "سيارات متوفرة",
  "هيونداي",
  "مرسيدس",
];

function testSearch(query) {
  const searchTerms = query.toLowerCase();
  
  const carMakes = [
    { ar: ["اودي", "أودي"], en: "audi" },
    { ar: ["بي ام دبليو", "بي إم دبليو", "بي أم دبليو", "بيام دبليو"], en: "bmw" },
    { ar: ["مرسيدس", "مرسيدس بنز"], en: "mercedes" },
    { ar: ["هيونداي", "هونداي"], en: "hyundai" },
  ];

  console.log(`\nTesting: "${query}"`);
  console.log(`  Search terms: "${searchTerms}"`);
  
  let found = false;
  carMakes.forEach(({ ar, en }) => {
    const matchesArabic = ar.some(arabicName => searchTerms.includes(arabicName));
    const matchesEnglish = searchTerms.includes(en.toLowerCase());
    
    if (matchesArabic || matchesEnglish) {
      console.log(`  ✅ Matched: ${en}`);
      found = true;
    }
  });
  
  if (!found) {
    console.log(`  ❌ No match found`);
  }
}

console.log('=== Arabic Car Name Matching Test ===\n');
testQueries.forEach(testSearch);
console.log('\n=== Test Complete ===');
