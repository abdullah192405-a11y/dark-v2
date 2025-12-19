/**
 * Test script for improved search functionality
 * Tests searching by: model name only, brand only, color only
 */

import { getChatbotResponse } from './src/actions/chatbot.js';

console.log('🧪 Testing Improved Search Functionality\n');
console.log('=' .repeat(60));

const conversationHistory = [];

// Test 1: Search by model name only (e.g., "كامري")
console.log('\n📝 Test 1: Search by MODEL NAME only - "كامري"\n');
const response1 = await getChatbotResponse('كامري', conversationHistory);

console.log('🤖 Bot Response:');
console.log(response1.message.substring(0, 200) + '...');
console.log(`\n📊 Found ${response1.carsFound} cars`);
console.log(`🎯 Showing ${response1.cars?.length || 0} cars`);

if (response1.cars && response1.cars.length > 0) {
  console.log('\n✅ Cars found:');
  response1.cars.forEach((car, index) => {
    console.log(`   ${index + 1}. ${car.make} ${car.model} (${car.year}) - ${car.color}`);
  });
} else {
  console.log('\n❌ No cars found for "كامري"');
}

// Test 2: Search by brand only (e.g., "تويوتا")
console.log('\n' + '='.repeat(60));
console.log('\n📝 Test 2: Search by BRAND only - "تويوتا"\n');
const response2 = await getChatbotResponse('تويوتا', []);

console.log('🤖 Bot Response:');
console.log(response2.message.substring(0, 200) + '...');
console.log(`\n📊 Found ${response2.carsFound} cars`);
console.log(`🎯 Showing ${response2.cars?.length || 0} cars`);

if (response2.cars && response2.cars.length > 0) {
  console.log('\n✅ Cars found:');
  response2.cars.forEach((car, index) => {
    console.log(`   ${index + 1}. ${car.make} ${car.model} (${car.year})`);
  });
} else {
  console.log('\n❌ No cars found for "تويوتا"');
}

// Test 3: Search by color only (e.g., "احمر")
console.log('\n' + '='.repeat(60));
console.log('\n📝 Test 3: Search by COLOR only - "احمر"\n');
const response3 = await getChatbotResponse('احمر', []);

console.log('🤖 Bot Response:');
console.log(response3.message.substring(0, 200) + '...');
console.log(`\n📊 Found ${response3.carsFound} cars`);
console.log(`🎯 Showing ${response3.cars?.length || 0} cars`);

if (response3.cars && response3.cars.length > 0) {
  console.log('\n✅ Cars found:');
  response3.cars.forEach((car, index) => {
    console.log(`   ${index + 1}. ${car.make} ${car.model} - ${car.color}`);
  });
} else {
  console.log('\n❌ No cars found for "احمر"');
}

// Test 4: Search by model in English (e.g., "camry")
console.log('\n' + '='.repeat(60));
console.log('\n📝 Test 4: Search by MODEL in English - "camry"\n');
const response4 = await getChatbotResponse('camry', []);

console.log('🤖 Bot Response:');
console.log(response4.message.substring(0, 200) + '...');
console.log(`\n📊 Found ${response4.carsFound} cars`);
console.log(`🎯 Showing ${response4.cars?.length || 0} cars`);

if (response4.cars && response4.cars.length > 0) {
  console.log('\n✅ Cars found:');
  response4.cars.forEach((car, index) => {
    console.log(`   ${index + 1}. ${car.make} ${car.model} (${car.year})`);
  });
} else {
  console.log('\n❌ No cars found for "camry"');
}

// Test 5: Combined search (brand + model)
console.log('\n' + '='.repeat(60));
console.log('\n📝 Test 5: Combined search - "تويوتا كامري"\n');
const response5 = await getChatbotResponse('تويوتا كامري', []);

console.log('🤖 Bot Response:');
console.log(response5.message.substring(0, 200) + '...');
console.log(`\n📊 Found ${response5.carsFound} cars`);
console.log(`🎯 Showing ${response5.cars?.length || 0} cars`);

if (response5.cars && response5.cars.length > 0) {
  console.log('\n✅ Cars found:');
  response5.cars.forEach((car, index) => {
    console.log(`   ${index + 1}. ${car.make} ${car.model} (${car.year})`);
  });
} else {
  console.log('\n❌ No cars found for "تويوتا كامري"');
}

console.log('\n' + '='.repeat(60));
console.log('\n🎉 Test Complete!\n');

// Summary
console.log('📋 Summary:');
console.log(`   Test 1 (كامري): ${response1.carsFound} cars found`);
console.log(`   Test 2 (تويوتا): ${response2.carsFound} cars found`);
console.log(`   Test 3 (احمر): ${response3.carsFound} cars found`);
console.log(`   Test 4 (camry): ${response4.carsFound} cars found`);
console.log(`   Test 5 (تويوتا كامري): ${response5.carsFound} cars found`);
console.log('\n');
