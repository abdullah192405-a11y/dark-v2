/**
 * Test script to demonstrate contextual memory in chatbot
 * This tests the scenario:
 * 1. User searches for "سيارة عائلية" (family car)
 * 2. User asks "what cars are available?" 
 * 3. Chatbot should remember context and show only family cars
 */

import { getChatbotResponse } from './src/actions/chatbot.js';

console.log('🧪 Testing Chatbot Context Memory\n');
console.log('=' .repeat(60));

// Simulate a conversation
const conversationHistory = [];

// Step 1: User searches for family car
console.log('\n📝 Step 1: User searches for "سيارة عائلية" (family car)\n');
const response1 = await getChatbotResponse('سيارة عائلية', conversationHistory);

console.log('🤖 Bot Response:');
console.log(response1.message);
console.log(`\n📊 Found ${response1.carsFound} cars`);
console.log(`🎯 Showing ${response1.cars?.length || 0} cars`);

// Add to conversation history
conversationHistory.push({
  sender: 'user',
  text: 'سيارة عائلية',
  timestamp: new Date()
});

conversationHistory.push({
  sender: 'bot',
  text: response1.message,
  cars: response1.cars,
  timestamp: new Date()
});

// Step 2: User asks general follow-up question
console.log('\n' + '='.repeat(60));
console.log('\n📝 Step 2: User asks "what cars are available?" (should maintain family car context)\n');

const response2 = await getChatbotResponse('ايش السيارات المتوفرة؟', conversationHistory);

console.log('🤖 Bot Response:');
console.log(response2.message);
console.log(`\n📊 Found ${response2.carsFound} cars`);
console.log(`🎯 Showing ${response2.cars?.length || 0} cars`);

// Verify the context was maintained
if (response2.cars && response2.cars.length > 0) {
  console.log('\n✅ CONTEXT MAINTAINED - Here are the car body types shown:');
  const bodyTypes = [...new Set(response2.cars.map(car => car.bodyType))];
  bodyTypes.forEach(type => {
    console.log(`   - ${type}`);
  });
  
  // Check if these are family-friendly cars
  const familyTypes = ['دفع رباعي', 'SUV', 'ميني فان', 'فان'];
  const isFamilyCars = response2.cars.every(car => 
    familyTypes.some(type => car.bodyType?.includes(type))
  );
  
  if (isFamilyCars) {
    console.log('\n✅ SUCCESS: All cars shown are family-friendly vehicles!');
  } else {
    console.log('\n⚠️ WARNING: Some cars shown may not be family-friendly');
  }
} else {
  console.log('\n❌ FAILED: No cars shown or context was lost');
}

console.log('\n' + '='.repeat(60));
console.log('\n🎉 Test Complete!\n');
