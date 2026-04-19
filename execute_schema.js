const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ncsejvzgencnobkkwaph.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jc2VqdnpnZW5jbm9ia2t3YXBoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMyMDc2MSwiZXhwIjoyMDkxODk2NzYxfQ.CpFzyNeY5wJj-rj04q91I4HRzfx8jgJErDa8O1z6eyQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const sql = fs.readFileSync('./apps/api/supabase/setup.sql', 'utf8');
  console.log("Attempting to execute SQL via RPC...");
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.error("RPC Error:", error);
    process.exit(1);
  }
  console.log("Success:", data);
}
run();
