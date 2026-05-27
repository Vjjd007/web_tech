const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = require('../services/supabaseClient');

async function run() {
  if (!supabase) {
    console.error('Supabase client not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, '..', 'sql', 'init_supabase.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  try {
    console.log('Running SQL against Supabase...');
    // supabase.postgres.query expects an object with sql property
    const res = await supabase.postgres.query({ sql });
    if (res.error) {
      console.error('Error executing SQL:', res.error);
      process.exit(1);
    }
    console.log('SQL executed successfully. Result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Execution failed:', err);
    process.exit(1);
  }
}

run();
