# Google OAuth 2.0 Implementation Guide

Complete guide for implementing Google Authentication in AI Mentor application.

---

## **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Google Cloud Setup](#google-cloud-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Testing](#testing)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## **Prerequisites**

- Node.js (v18+)
- npm or yarn
- Google Cloud Account
- NextJS Application Running
- Express Backend Running

---

## **Google Cloud Setup**

### **Step 1: Create a Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** → **"New Project"**
3. Enter project name: `AI Mentor`
4. Click **"Create"**

### **Step 2: Enable Google+ API**

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Select it and click **"Enable"**

### **Step 3: Create OAuth 2.0 Credentials**

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Select **"Web application"**
4. Enter the following:
   - **Name**: `AI Mentor Web App`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `http://localhost:5001`
     - `https://yourdomain.com`
   - **Authorized redirect URIs**: 
     - `http://localhost:5001/auth/google/callback`
     - `https://yourdomain.com/auth/google/callback`

5. Click **"Create"**
6. Copy your **Client ID** and **Client Secret**

---

## **Backend Configuration**

### **Step 1: Install Dependencies**

```bash
cd apps/api
npm install passport passport-google-oauth20 express-session jsonwebtoken
```

### **Step 2: Create `.env` File**

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

```env
# Environment
NODE_ENV=development

# Server
PORT=5001
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5001

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Security
JWT_SECRET=generate_a_random_string_here
SESSION_SECRET=generate_another_random_string_here

# Supabase (Optional)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### **Step 3: File Structure**

The following files have been created/updated:

```
apps/api/
├── src/
│   ├── config/
│   │   ├── env.js (UPDATED - added OAuth vars)
│   │   └── passport.js (NEW - OAuth strategy)
│   ├── controllers/
│   │   ├── auth.controller.js (NEW - auth logic)
│   │   └── ... (other controllers)
│   ├── routes/
│   │   ├── auth.routes.js (NEW - auth endpoints)
│   │   └── ... (other routes)
│   ├── middleware/
│   │   └── ... (existing middleware)
│   └── server.js (UPDATED - added passport & session)
├── package.json (UPDATED - added dependencies)
├── .env.example (UPDATED - added OAuth vars)
└── ...
```

### **Step 4: Backend Endpoints**

The following API endpoints are available:

#### **Login with Google**
```
GET /auth/google
```
Redirects user to Google login page

#### **Google OAuth Callback**
```
GET /auth/google/callback
```
Google redirects here after authentication. Returns JWT token.

#### **Get Current User**
```
GET /auth/user
Authorization: Bearer {token}
```
Returns current user information

#### **Verify Token**
```
GET /auth/verify
Authorization: Bearer {token}
```
Validates if token is still active

#### **Logout**
```
POST /auth/logout
Authorization: Bearer {token}
```
Invalidates session (frontend should clear localStorage)

---

## **Frontend Configuration**

### **Step 1: Update Environment Variables**

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### **Step 2: Frontend File Structure**

```
apps/web/
├── src/
│   ├── hooks/
│   │   └── useAuth.ts (UPDATED - added Google OAuth hooks)
│   ├── app/
│   │   └── (auth)/
│   │       ├── login/
│   │       │   └── page.tsx (signup button added)
│   │       ├── signup/
│   │       │   └── page.tsx (Google button integrated)
│   │       └── auth/
│   │           └── callback/
│   │               └── page.tsx (NEW - OAuth callback handler)
│   └── ...
└── ...
```

### **Step 3: Frontend Components**

#### **useGoogleAuth Hook**

```typescript
import { useGoogleAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { handleGoogleLogin, handleLogout } = useGoogleAuth();

  return (
    <>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
```

### **Step 4: Page Structure**

- **Login Page**: `/login` - Email/Username + Password + Google button
- **Signup Page**: `/signup` - Email/Username + Password + Google button
- **Callback Page**: `/auth/callback` - Handles OAuth redirect (internal)
- **Dashboard**: `/chat` - Protected (requires authentication)

---

## **Testing**

### **Local Testing**

1. **Start the backend:**
```bash
cd apps/api
npm install
npm run dev
```

2. **Start the frontend:**
```bash
cd apps/web
npm install
npm run dev
```

3. **Test OAuth Flow:**
   - Go to `http://localhost:3000/signup`
   - Click "Continue with Google"
   - You'll be redirected to Google login
   - After login, you'll be redirected to `/auth/callback`
   - Then automatically redirect to `/chat`

### **Manual Testing Steps**

1. **Test Google Login:**
   - Click "Continue with Google" button
   - Select Google account
   - Verify you're redirected to dashboard

2. **Test Token Persistence:**
   - Open browser DevTools → Application → localStorage
   - Verify `authToken` is stored
   - Verify `user` data is stored

3. **Test Logout:**
   - Click logout button
   - Verify localStorage is cleared
   - Verify you're redirected to login page

4. **Test Protected Routes:**
   - Try accessing `/chat` without token
   - Should redirect to `/login`

---

## **Security Best Practices**

### **1. Environment Variables**
- ✅ Never commit `.env` files
- ✅ Use `.env.example` template
- ✅ Rotate secrets regularly
- ✅ Use strong random strings for secrets

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **2. JWT Token Security**
- ✅ Use HTTPS in production
- ✅ httpOnly cookies (in production)
- ✅ Short token expiration (7 days max)
- ✅ Implement token refresh mechanism

### **3. CORS Configuration**
Only allow requests from your frontend domain:

```javascript
// Production
cors({ 
  origin: 'https://yourdomain.com',
  credentials: true
})
```

### **4. Session Security**
```javascript
session({
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000
  }
})
```

### **5. Database Security** (when implemented)
- ✅ Hash stored passwords
- ✅ Don't store sensitive data
- ✅ Use parameterized queries
- ✅ Implement rate limiting

### **6. API Security**
- ✅ Validate all inputs
- ✅ Implement rate limiting
- ✅ Use HTTPS
- ✅ Add request validation middleware

---

## **Troubleshooting**

### **Issue: "Redirect URI mismatch" error**

**Solution:** 
- Verify redirect URI in Google Cloud Console matches exactly
- Include protocol (http/https) and port
- No trailing slashes

```
✓ http://localhost:5001/auth/google/callback
✗ http://localhost:5001/auth/google/callback/
✗ localhost:5001/auth/google/callback
```

### **Issue: "Client ID not found" error**

**Solution:**
- Verify `GOOGLE_CLIENT_ID` is in `.env`
- Check it's not wrapped in quotes incorrectly
- Restart backend server after updating `.env`

### **Issue: CORS errors in browser**

**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS middleware is configured
- Check browser console for exact error

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### **Issue: Token not persisting in localStorage**

**Solution:**
- Check browser DevTools → Application → LocalStorage
- Verify callback page is reached
- Check browser console for errors
- Verify `handleOAuthCallback` is called

### **Issue: "Cannot find module 'passport'"**

**Solution:**
- Run `npm install` in `apps/api`
- Delete `node_modules` and reinstall if needed
- Check package.json has dependencies

---

## **Production Deployment**

### **1. Environment Variables (Production)**
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
JWT_SECRET=long_random_production_secret
SESSION_SECRET=long_random_production_secret
```

### **2. Deploy Considerations**
- ✅ Use environment-specific configs
- ✅ Enable HTTPS
- ✅ Update Google Cloud OAuth redirect URIs
- ✅ Implement database for user storage
- ✅ Add logging and monitoring
- ✅ Setup error tracking (Sentry)

### **3. Database Integration** (Not yet implemented)

When ready, implement user persistence:

```typescript
// Pseudo-code
async function saveUser(profile) {
  return await db.users.upsert({
    where: { googleId: profile.id },
    create: {
      googleId: profile.id,
      email: profile.email,
      name: profile.displayName,
      picture: profile.photos[0]?.value,
      createdAt: new Date()
    },
    update: {
      lastLogin: new Date()
    }
  });
}
```

---

## **Additional Resources**

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## **Next Steps**

1. ✅ Setup Google Cloud Project
2. ✅ Add environment variables
3. ✅ Test OAuth flow
4. ✅ Implement user database storage
5. ✅ Add refresh token mechanism
6. ✅ Setup error handling and logging
7. ✅ Deploy to production

---

**Questions?** Check the backend logs:
```bash
# Backend - watch for auth logs
npm run dev
```

Check frontend console:
```javascript
// DevTools → Console → Check for errors
localStorage.getItem('authToken')
```

---

Generated: 2026-04-15
