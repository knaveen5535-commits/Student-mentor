# Supabase Auth Setup Guide

Complete setup guide for Google OAuth authentication with Supabase.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: `ai-mentor`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users (e.g., `us-east-1`)
5. Click "Create new project"
6. Wait for project initialization (~2 minutes)

## Step 2: Get Supabase API Keys

1. Navigate to **Project Settings** → **API** (left sidebar)
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. These are public keys - safe to commit (but listed in `.env.local` for security)

## Step 3: Set Up Google OAuth

### 3.1 Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project:
   - Click "Select a Project" → "NEW PROJECT"
   - Name: `ai-mentor`
   - Click "Create"
3. Enable Google+ API:
   - Search "Google+ API" in the search bar
   - Click it and press "Enable"
4. Create OAuth Credentials:
   - Go to **Credentials** (left sidebar)
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - If prompted: Configure OAuth Consent Screen first
     - Choose "External"
     - Fill in app name, user support email, and click "Save and Continue"
     - Add your email as a test user
   - Choose application type: **Web application**
   - Name: `ai-mentor-web`
   - Add Authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://yourdomain.com/auth/callback
     https://yourdomain.com/auth/callback/(any supabase domain)
     ```
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

### 3.2 Configure Supabase with Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click "Google"
3. Fill in:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
4. Click "Save"
5. Note the Supabase Redirect URL shown (usually `https://[PROJECT-ID].supabase.co/auth/v1/callback`)
6. **ADD THIS REDIRECT URL** to your Google OAuth credentials:
   - Go back to Google Cloud Console → Credentials
   - Click your OAuth Client ID
   - Add the Supabase callback URL to Authorized redirect URIs

## Step 4: Configure Frontend Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Redirect URL (usually matches window.location.origin)
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
```

### Get These Values:

- Go to Supabase project dashboard
- Click **Settings** → **API**
- Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 5: Test the Setup

1. Install dependencies (if not already done):
   ```bash
   cd apps/web
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000
4. Go to Sign Up or Login page
5. Click "Continue with Google"
6. You should see Google login popup
7. After login, you should be redirected to `/auth/callback` then `/chat`
8. Check browser console for logs (should see √ Session established, redirecting to dashboard...)
9. User profile should appear in top-right corner of app

## Troubleshooting

### ❌ "Redirect URI Mismatch" Error

**Cause**: Redirect URL in Google OAuth settings doesn't match what Supabase is sending

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit the OAuth Client ID
3. Under "Authorized redirect URIs", make sure BOTH are present:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-project-id.supabase.co/auth/v1/callback` (from Supabase)
4. Save changes
5. Click logout and refresh the browser (Ctrl+Shift+R)

### ❌ User Session is Null/Undefined

**Cause**: Session not being read from localStorage or Supabase callback failed

**Solution**:
1. Open browser DevTools → Application → Local Storage
2. Look for key `ai_workspace_user_profile`
3. If empty or missing:
   - Go to login page
   - Open console (F12)
   - Watch the logs during Google OAuth flow
   - Should see:
     - "Processing OAuth callback..."
     - "Session established, redirecting to dashboard..."
     - If not, check the error message
4. Clear browser cache and try again

### ❌ "400 Bad Request" During Google Signup

**Cause**: Missing required fields or invalid request format

**Solution**:
1. Check browser console for detailed error message
2. Verify Supabase API keys are correct in `.env.local`
3. Make sure Google OAuth is enabled in Supabase
4. Test with Google credentials that were added as test users in Google Cloud Console

### ❌ User Profile Shows Email But Not Name

**Cause**: Google OAuth user_metadata might not have full_name

**Solution**:
1. This is normal - not all Google accounts provide full_name
2. The hook will use `email` as fallback (see [useSupabaseAuth.ts](../hooks/useSupabaseAuth.ts))
3. Optional: Update user profile manually in Supabase SQL editor

### ⚠️ Localhost Redirect Not Working

**Cause**: Browser blocking localhost redirects or CORS issue

**Solution**:
1. Make sure you're using `http://localhost:3000` (not `127.0.0.1`)
2. Check that the Next.js dev server is running
3. In browser console, check for CORS errors
4. If using HTTPS locally, use proper SSL certificate

## Environment Variable Reference

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | Supabase Dashboard → Settings → API → anon public key |
| `NEXT_PUBLIC_REDIRECT_URL` | Your app URL (localhost:3000 for dev) | Leave as is for local development |

## File Structure

```
apps/web/
├── .env.local                    # ← Create this file with env vars
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx            # ✅ Updated to use Supabase
│   │   │   ├── signup/page.tsx           # ✅ Updated to use Supabase
│   │   │   └── auth/callback/page.tsx    # ✅ Updated for Supabase redirect
│   │   └── (workspace)/
│   │       └── layout.tsx                # ✅ Updated with ProtectedRoute
│   ├── components/
│   │   ├── ProtectedRoute.tsx            # ✅ New - route protection
│   │   └── layout/
│   │       ├── AppShell.tsx              # ✅ Updated for Supabase logout
│   │       └── Sidebar.tsx
│   ├── hooks/
│   │   ├── useSupabaseAuth.ts            # ✅ New - all auth logic
│   │   └── useAuth.ts                    # Old - deprecated
│   └── lib/
│       └── supabase.ts                   # ✅ Updated - Supabase client
└── package.json                          # ✅ Updated - Supabase dependency
```

## Deployment

### Production Deployment on Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your-production-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-production-key
   NEXT_PUBLIC_REDIRECT_URL = https://yourdomain.com
   ```
4. Update Google OAuth redirect URIs:
   - Add: `https://yourdomain.com/auth/callback`
   - Keep: `https://[PROJECT-ID].supabase.co/auth/v1/callback`
5. Deploy!

### Production Deployment on Other Platforms

Same as Vercel, but:
1. Set environment variables in your platform's settings
2. Update Google OAuth redirect URIs to match your deployment domain
3. Update Supabase API key if different for production

## Next Steps

- ✅ Authentication is now fully functional
- Consider adding:
  - Email/password authentication (optional)
  - Password reset flow
  - User profile management
  - Role-based access control (RBAC)
  - Audit logs for security

## Support

For issues:
1. Check the **Troubleshooting** section above
2. Review [useSupabaseAuth.ts](../hooks/useSupabaseAuth.ts) comments
3. Check Supabase documentation: https://supabase.com/docs/guides/auth
4. Check Next.js documentation: https://nextjs.org/docs
