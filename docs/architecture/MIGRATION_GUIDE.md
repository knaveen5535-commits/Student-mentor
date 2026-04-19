# Migration Guide: Old Structure → New Structure

## Overview
The workspace has been restructured from a **flat controller/service/route organization** to a **feature-based modular architecture**. This improves scalability, collaboration, and maintainability.

## Changes Summary

### Backend

**Before:**
```
apps/api/src/
├── controllers/      (all controllers mixed)
├── services/         (all services mixed)
├── routes/          (all routes mixed)
└── middleware/
```

**After:**
```
packages/api/src/features/
├── auth/
│   ├── controller.js
│   ├── service.js
│   ├── routes.js
│   └── types.js
├── chat/            (same structure)
├── projects/        (same structure)
└── [more features]
```

### Frontend

**Before:**
```
apps/web/src/
├── components/      (all components mixed)
├── hooks/           (all hooks mixed)
├── store/           (all stores mixed)
└── app/             (pages)
```

**After:**
```
packages/web/src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store.ts
│   │   └── pages/
│   ├── chat/        (same structure)
│   ├── projects/    (same structure)
│   └── [more features]
└── shared/          (global utilities)
```

## File Migrations

### Backend Files

| Old Path | New Path |
|----------|----------|
| `controllers/auth.controller.js` | `features/auth/controller.js` |
| `controllers/chat.controller.js` | `features/chat/controller.js` |
| `services/auth.service.js` | `features/auth/service.js` |
| `routes/auth.routes.js` | `features/auth/routes.js` |
| `middleware/auth.middleware.js` | `core/middleware/auth.js` |
| `config/passport.js` | `core/config/passport.js` |

### Frontend Files

| Old Path | New Path |
|----------|----------|
| `components/chat/` | `features/chat/components/` |
| `components/project/` | `features/projects/components/` |
| `components/ProtectedRoute.tsx` | `shared/components/common/ProtectedRoute.tsx` |
| `components/ui/` | `shared/components/ui/` |
| `components/layout/` | `shared/components/layout/` |
| `hooks/useChat.ts` | `features/chat/hooks/useChat.ts` |
| `store/chatStore.ts` | `features/chat/store.ts` |

## How to Migrate Existing Code

### Step 1: Backend Features

For each feature (auth, chat, projects, tutorials, profile, upload):

1. Move `controllers/[feature].controller.js` → `features/[feature]/controller.js`
2. Move `services/[feature].service.js` → `features/[feature]/service.js`
3. Move `routes/[feature].routes.js` → `features/[feature]/routes.js`
4. Create `features/[feature]/index.js` exporting the module

**Example:**
```javascript
// features/auth/index.js
module.exports = {
  controller: require('./controller'),
  routes: require('./routes'),
  service: require('./service'),
};
```

### Step 2: Backend Core Files

Move shared utilities:
- `config/passport.js` → `core/config/passport.js`
- `config/env.js` → `core/config/env.js`
- `middleware/auth.middleware.js` → `core/middleware/auth.js`
- `middleware/error.middleware.js` → `core/middleware/error.js`

### Step 3: Frontend Features

For each feature page (auth, chat, projects, etc.):

1. **Pages:** Move to `features/[feature]/pages/`
2. **Components:** Move to `features/[feature]/components/`
3. **Hooks:** Create `features/[feature]/hooks/useFeature.ts`
4. **Store:** Rename store to `features/[feature]/store.ts`
5. **Types:** Create `features/[feature]/types.ts`

**Example for Chat:**
```
features/chat/
├── pages/
│   └── ChatPage.tsx     (from app/(workspace)/chat/page.tsx)
├── components/
│   ├── ChatInput.tsx    (from components/chat/ChatInput.tsx)
│   └── MessageList.tsx  (from components/chat/MessageList.tsx)
├── hooks/
│   └── useChat.ts       (from hooks/useChat.ts)
├── store.ts             (from store/chatStore.ts)
├── types.ts             (new - extract types)
└── index.ts             (exports)
```

### Step 4: Shared Components

Global components that used by multiple features:
- Move to `shared/components/ui/` (primitives: Button, Input, Card, Badge)
- Move to `shared/components/layout/` (Sidebar, Header, Footer)
- Move to `shared/components/common/` (ProtectedRoute, ErrorBoundary, etc.)

### Step 5: Update Imports

**Old Imports:**
```typescript
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { chatStore } from '@/store/chatStore';
```

**New Imports:**
```typescript
import { ChatInput } from '@/features/chat/components';
import { useChat } from '@/features/chat/hooks';
import { useChatStore } from '@/features/chat/store';
```

### Step 6: Register Routes

Update `packages/api/src/server.js`:

**Before:**
```javascript
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/chat.routes'));
```

**After:**
```javascript
app.use('/api', require('./features/auth/routes'));
app.use('/api', require('./features/chat/routes'));
```

## API No Changes

- All API endpoints remain the same
- `/api/auth/*`, `/api/chat/*`, `/api/projects/*`, etc.
- Client doesn't need any changes

## Breaking Changes

None! The migration is internal. External interfaces (API, components) remain compatible.

## Benefits After Migration

✅ **Scalability** - Easy to add new features  
✅ **Modularity** - Features are self-contained  
✅ **Collaboration** - Clear feature ownership  
✅ **Maintainability** - Changes isolated to one feature  
✅ **Testing** - Feature-specific tests  
✅ **Developer Experience** - Less searching, more focus  

## Next Steps

1. Follow steps 1-6 above for complete migration
2. Update all imports in components and pages
3. Test all features work correctly
4. Update CI/CD pipelines if needed
5. Document any custom conventions in feature READMEs

## Questions?

Refer to:
- [FEATURE_GUIDE.md](./FEATURE_GUIDE.md) - How to add new features
- [STRUCTURE.md](./STRUCTURE.md) - Architecture overview
- Feature READMEs in each `features/[feature]/README.md`
