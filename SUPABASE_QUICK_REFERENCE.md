# Supabase OAuth - Quick Reference

## 🚀 5-Minute Setup

### 1. Get Supabase Keys
- Create project at [supabase.com](https://supabase.com)
- Get from **Settings → API**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Set Up Google OAuth
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 client ID
- Add redirect URIs:
  - `http://localhost:3000/auth/callback`
  - `https://[PROJECT-ID].supabase.co/auth/v1/callback`

### 3. Configure Supabase
- In Supabase: **Authentication → Providers → Google**
- Paste Google Client ID and Secret
- Supabase generates a redirect URL

### 4. Complete Google Setup
- Go back to Google Cloud Console
- Add Supabase callback URL to redirect URIs:
  - `https://[PROJECT-ID].supabase.co/auth/v1/callback`

### 5. Create `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
```

### 6. Test
```bash
cd apps/web
npm install
npm run dev
# Go to http://localhost:3000/login
# Click "Continue with Google"
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `useSupabaseAuth.ts` | Auth logic & state management |
| `ProtectedRoute.tsx` | Route protection wrapper |
| `auth/callback/page.tsx` | OAuth callback handler |
| `supabase.ts` | Client configuration |
| `SUPABASE_AUTH_SETUP.md` | Detailed setup guide |

## 🔐 User Authentication

### Login Flow
```
User clicks "Continue with Google"
↓
loginWithGoogle() called
↓
Google OAuth popup
↓
User authenticates
↓
Redirects to /auth/callback
↓
Session extracted
↓
Redirects to /chat
```

### Checking Auth Status
```typescript
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function MyComponent() {
  const { user, loading, logout } = useSupabaseAuth();
  
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not authenticated</p>;
  
  return (
    <div>
      <p>Hello, {user.name || user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

function SecretPage() {
  return (
    <ProtectedRoute>
      <MyContent />
    </ProtectedRoute>
  );
}
```

## 📊 User Data

### Stored Locally
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "provider": "google"
}
```

### Access Anywhere
```typescript
const { user } = useSupabaseAuth();
console.log(user?.email);
```

## 🔧 Common Tasks

### Get Current User
```typescript
const { user } = useSupabaseAuth();
```

### Log Out
```typescript
const { logout } = useSupabaseAuth();
logout(); // Logs out and redirects to /login
```

### Check if Loading
```typescript
const { loading } = useSupabaseAuth();
if (loading) return <Spinner />;
```

### Protect a Page
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

## ❌ Troubleshooting

### "Redirect URI Mismatch"
1. Go to Google Cloud Console → Credentials
2. Edit OAuth client ID
3. Add BOTH:
   - `http://localhost:3000/auth/callback`
   - `https://[PROJECT-ID].supabase.co/auth/v1/callback`

### "User is null"
1. Open Dev Tools → Application → Local Storage
2. Look for `ai_workspace_user_profile` key
3. If empty:
   - Try a different Google account
   - Click Logout first
   - Clear browser cache

### "400 Bad Request"
1. Check `.env.local` has correct keys
2. Verify Google OAuth is enabled in Supabase
3. Check browser console for detailed error

### "Stuck on /auth/callback"
1. Look at browser console logs
2. Check Supabase dashboard → Logs
3. Verify `.env.local` is correct
4. Try with different Google account

## 📚 Environment Variables

Create `apps/web/.env.local`:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional (defaults to localhost:3000)
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
```

## 🌐 Deployment

### Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add env vars:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-production-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
   NEXT_PUBLIC_REDIRECT_URL=https://yourdomain.com
   ```
4. Update Google OAuth redirect URIs

### Other Platforms
Same as Vercel - set env vars and update OAuth redirect URIs

## 📖 Full Guides

- **Setup**: See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)
- **Details**: See [SUPABASE_INTEGRATION_SUMMARY.md](SUPABASE_INTEGRATION_SUMMARY.md)

## 🎯 What's Included

✅ Google OAuth login/signup
✅ Automatic session persistence
✅ Route protection
✅ User profile display
✅ Logout functionality
✅ Error handling
✅ localStorage integration
✅ Typescript support
✅ Colorful UI (existing)
✅ Console logging for debugging

## 📞 Need Help?

1. Check browser console (F12)
2. Check Supabase dashboard
3. Read SUPABASE_AUTH_SETUP.md troubleshooting
4. Try with different Google account
5. Clear localStorage and try again

---

**Status**: ✅ Production Ready
