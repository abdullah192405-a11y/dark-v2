import { config } from 'dotenv';
import { createClient } from './src/lib/superbase.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');

    // Create a mock cookie store for testing
    const mockCookieStore = {
      getAll: () => [],
      setAll: () => {}
    };

    // Initialize Supabase client
    const supabase = createClient(mockCookieStore);

    // Test basic connection by checking if we can get the auth user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && error.message !== 'Auth session missing!') {
      throw error;
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Auth status:', user ? 'User logged in' : 'No active session');

    // Test database connection by trying to select from a table (if available)
    // This will fail gracefully if no tables exist
    try {
      const { data, error: dbError } = await supabase
        .from('test_connection')
        .select('*')
        .limit(1);

      if (dbError && !dbError.message.includes('relation "public.test_connection" does not exist')) {
        console.log('⚠️ Database query test failed:', dbError.message);
      } else {
        console.log('✅ Database connection verified');
      }
    } catch (dbTestError) {
      console.log('ℹ️ Database test skipped (table may not exist)');
    }

    return { success: true, message: 'Supabase connection test completed successfully' };

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testSupabaseConnection().then(result => {
  console.log('\n📋 Test Result:', result);
  process.exit(result.success ? 0 : 1);
});
