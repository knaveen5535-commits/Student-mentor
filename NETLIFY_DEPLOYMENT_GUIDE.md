# Netlify Deployment Guide for Next.js

This guide provides step-by-step instructions to deploy your Next.js application on Netlify.

## Prerequisites

- Netlify account ([sign up here](https://netlify.com))
- Git repository (GitHub, GitLab, or Bitbucket)
- Your code pushed to a git repository

## Quick Setup Steps

### 1. **Connect Your Repository to Netlify**

#### Option A: Via Netlify Dashboard (Recommended)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your MENTOR repository
6. Configure build settings (recommended with this repo):
  - **Base directory**: `apps/web`
  - **Build command**: `npm run build`
  - **Publish directory**: `.next`

  Note: this repo also includes a root `netlify.toml` that sets the same values. If you set these in the UI, keep them consistent with `netlify.toml`.

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to web app directory
cd apps/web

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### 2. **Set Environment Variables**

In Netlify Dashboard:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add the following environment variables:

```
NEXT_PUBLIC_API_URL = https://your-api-domain.com
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_key
```

Tip: set `NEXT_PUBLIC_API_URL` to the API origin only (no trailing slash, no extra `/api`). Example: `https://api.example.com`.

Replace with your actual values.

### 3. **Configure API Backend**

Since your Next.js app makes requests to `http://localhost:5001`, update your production API URL:

**Option A: Use Environment Variable (Recommended)**
- Set `NEXT_PUBLIC_API_URL` in Netlify dashboard
- Your `next.config.js` already handles this

**Option B: Deploy Your API on Netlify**
1. Deploy your API separately (Railway/Render/Fly.io/etc.)
2. Set `NEXT_PUBLIC_API_URL` in Netlify to that deployed API origin (example: `https://api.example.com`)

### 4. **Handle Monorepo Dependencies**

Since you have a monorepo structure, ensure proper dependency installation:

1. Create `.nvmrc` in project root (optional):
```
20.17.0
```

2. Ensure `netlify.toml` exists in the project root (recommended for monorepos):
```toml
[build]
  base = "apps/web"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 5. **Important Configuration Points**

Your `netlify.toml` includes:
- ✅ Correct build command
- ✅ Correct publish directory (`.next`)
- ✅ Security headers
- ✅ Cache optimization
- ✅ API rewrites configuration

### 6. **Deploy the Site**

#### Auto Deploy (Recommended)
1. Push code to your git repository
2. Netlify automatically builds and deploys on every push to main branch

#### Manual Deploy
```bash
cd apps/web
netlify deploy --prod
```

## Troubleshooting

### Build Fails: "npm run build" not found
- Ensure Node.js version 18+ is installed
- Check `package.json` has correct build script

### API Requests Fail (CORS)
- Add CORS headers to your backend API
- Update API URL in environment variables

### Static Files Not Loading
- Ensure `public/` directory has correct permissions
- Check cache headers in `netlify.toml`

### 3D Assets Not Loading
- Configure proper image domains in `next.config.js`
- Add Netlify header for static files

## Database Connection

For Supabase (already configured):
```bash
# In Netlify environment, set:
NEXT_PUBLIC_SUPABASE_URL = your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
```

## Post-Deployment

1. **Monitor builds**: Netlify Dashboard → Deploys
2. **Check logs**: Click a deploy → Deploy log
3. **Enable analytics**: Site settings → Analytics
4. **Set up notifications**: Build notifications and error alerts

## Advanced: Custom Domain

1. Go to Site settings → Domain management
2. Click **Add domain**
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Let's Encrypt)

## Performance Optimization

Your configuration includes:
- ✅ Image optimization
- ✅ Static asset caching (31536000s = 1 year)
- ✅ Dynamic content caching (3600s = 1 hour)
- ✅ Security headers

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/overview
- **Plugin Docs**: https://github.com/netlify/next-js-plugin

---

**Status**: Ready to deploy ✅
