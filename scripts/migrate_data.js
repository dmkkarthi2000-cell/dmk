import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const SOURCE_URL = 'https://uydyijlkadnrebvebabf.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5ZHlpamxrYWRucmVidmViYWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDg0MzksImV4cCI6MjA4ODU4NDQzOX0.QJ4L6FNcQSTbP7asQnmDi-IzZLAwdcbGGgLgQBUj098';

const TARGET_URL = 'https://qawkaknpcfkubekcoaqq.supabase.co';
const TARGET_KEY = 'sb_publishable_y83d375LM7QDwjl0b5hI3A_mJlCpekK'; 

// Tables to migrate
const TABLES = [
  'events',
  'gallery',
  'news',
  'site_settings',
  'videos',
  'youtube_channels'
];

async function migrate() {
  console.log('🚀 Starting Supabase Migration...');
  
  const source = createClient(SOURCE_URL, SOURCE_KEY);
  const target = createClient(TARGET_URL, TARGET_KEY);

  for (const table of TABLES) {
    console.log(`\n📦 Migrating table: ${table}...`);
    
    // 1. Fetch data from source
    const { data: sourceData, error: fetchError } = await source
      .from(table)
      .select('*');

    if (fetchError) {
      console.error(`❌ Error fetching from ${table}:`, fetchError.message);
      continue;
    }

    if (!sourceData || sourceData.length === 0) {
      console.log(`⚠️ No data found in ${table}. Skipping.`);
      continue;
    }

    console.log(`✅ Fetched ${sourceData.length} rows from source.`);

    // 2. Clear existing data in target (Optional but safer for clean migration)
    // Note: This might fail if there are foreign keys, but these tables seem independent.
    const { error: deleteError } = await target
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn(`⚠️ Warning: Could not clear target table ${table}:`, deleteError.message);
    }

    // 3. Insert into target
    // We insert in chunks to avoid payload size limits
    const chunkSize = 50;
    for (let i = 0; i < sourceData.length; i += chunkSize) {
      const chunk = sourceData.slice(i, i + chunkSize);
      const { error: insertError } = await target
        .from(table)
        .insert(chunk);

      if (insertError) {
        console.error(`❌ Error inserting into target ${table}:`, insertError.message);
        break;
      }
    }

    console.log(`✨ Successfully migrated ${table}!`);
  }

  console.log('\n🏁 Migration complete!');
}

migrate();
