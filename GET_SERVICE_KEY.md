# Get Your Real Supabase Service Role Key

Your current `.env` file has a placeholder for `SUPABASE_SERVICE_ROLE_KEY`. Follow these steps to get your real key:

## Steps:

1. Go to https://app.supabase.com
2. Log in and select your project "ncsejvzgencnobkkwaph"
3. Click on **Settings** in the left sidebar
4. Click on **API** 
5. Under "Project API keys", you'll see:
   - **anon (public)** - Already have this
   - **service_role (secret)** - Copy this long key

6. Update your `.env` file with the real `service_role` key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=<paste-the-actual-key-here>
   ```

## Alternative Method - Execute SQL Directly:

If you want to avoid using the script, you can execute the SQL directly in Supabase:

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/tutorials_data.sql`
5. Paste it into the query editor
6. Click **Run**

The tutorials will be inserted immediately!

## Then Run the Script:

Once you've updated the `.env` file with the real service role key, run:

```bash
node populate-tutorials.js
```

You should see output like:
```
🚀 Starting tutorial data population...
📝 Inserting 15 tutorials into database...
✅ Successfully inserted 15 tutorials!
```
