# Google OAuth 2.0 - Quick Start Guide

**Fast setup for Google OAuth 2.0 authentication in AI Mentor**

---

## **⚡ 5-Minute Setup**

### **Step 1: Get Google Credentials (5 mins)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project → Enable Google+ API
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:5001`
5. Add redirect URI:
   - `http://localhost:5001/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

### **Step 2: Configure Backend**

```bash
# Navigate to backend
cd apps/api

# Copy env template
cp .env.example .env

# Edit .env and add:
GOOGLE_CLIENT_ID=your_client_id_from_google
GOOGLE_CLIENT_SECRET=your_client_secret_from_google
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5001

# Install dependencies
npm install

# Start server
npm run dev
```

### **Step 3: Configure Frontend**

```bash
# Navigate to frontend
cd apps/web

# Create env file
echo 'NEXT_PUBLIC_API_URL=http://localhost:5001' > .env.local

# Start frontend
npm run dev
```

---

## **🧪 Test It**

1. Open `http://localhost:3000/signup`
2. Click **"Continue with Google"** button
3. Choose your Google account
4. You'll be logged in! 🎉

---

## **📁 What Was Added**

### **Backend**
- ✅ `src/config/passport.js` - OAuth strategy
- ✅ `src/controllers/auth.controller.js` - Login logic
- ✅ `src/routes/auth.routes.js` - Auth endpoints
- ✅ Updated `src/config/env.js` - OAuth variables
- ✅ Updated `src/server.js` - Passport middleware

### **Frontend**
- ✅ `src/hooks/useAuth.ts` - OAuth hooks
- ✅ `src/app/(auth)/auth/callback/page.tsx` - Callback handler
- ✅ Updated signup/login pages - Google buttons

### **Configuration**
- ✅ `.env.example` - Backend template
- ✅ `.env.local.example` - Frontend template

---

## **🔑 API Endpoints**

```bash
# Start login with Google
GET http://localhost:5001/auth/google

# Google redirects to callback
GET http://localhost:5001/auth/google/callback

# Get current user
GET http://localhost:5001/auth/user
Header: Authorization: Bearer {token}

# Verify token is valid
GET http://localhost:5001/auth/verify
Header: Authorization: Bearer {token}

# Logout
POST http://localhost:5001/auth/logout
Header: Authorization: Bearer {token}
```

---

## **🎨 Frontend Flow**

```
User clicks "Continue with Google"
    ↓
Frontend redirects to /auth/google
    ↓
Google OAuth page (user logs in)
    ↓
Backend creates JWT token
    ↓
Redirects to /auth/callback with token
    ↓
Frontend stores token in localStorage
    ↓
Redirects to /chat (dashboard)
```

---

## **❌ Common Issues & Fixes**

### **"Redirect URI mismatch"**
- Check Google Cloud Console
- Exact match required: `http://localhost:5001/auth/google/callback`

### **"CORS error"**
- Verify `FRONTEND_URL` in `.env`
- Restart backend after changes

### **"Token not saving"**
- Open DevTools → Application → LocalStorage
- Check for `authToken` key

### **"Module not found errors"**
- Run `npm install` in `apps/api`
- Delete `node_modules` and reinstall if stuck

---

## **🔐 Security Notes**

✅ **Do's:**
- Use environment variables for secrets
- Never commit `.env` file
- Use HTTPS in production
- Set `httpOnly` cookies in production
- Implement token expiration

❌ **Don'ts:**
- Don't hardcode credentials
- Don't commit secrets to git
- Don't expose tokens in URLs
- Don't skip HTTPS validation

---

## **📚 Next Steps**

1. ✅ Set up Google Cloud credentials
2. ✅ Configure `.env` files
3. ✅ Test OAuth flow
4. **→ Implement database user storage**
5. **→ Add refresh token mechanism**
6. **→ Deploy to production**

For detailed setup → see `GOOGLE_OAUTH_SETUP.md`

---

## **🆘 Need Help?**

Check logs:
```bash
# Backend logs
npm run dev

# Frontend console (DevTools → Console)
console.log(localStorage.getItem('authToken'))
```

Read full docs: [`GOOGLE_OAUTH_SETUP.md`](./GOOGLE_OAUTH_SETUP.md)

---

**That's it! You now have Google OAuth 2.0 working! 🚀**
