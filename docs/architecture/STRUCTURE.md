# AI Mentor - New Architecture Overview

## 🏗️ Feature-Based Organization

The workspace has been restructured using **feature-based modules** for better scalability, collaboration, and maintainability.

```
mentor/
├── packages/
│   ├── api/                          # Backend (Node.js + Express)
│   │   ├── src/
│   │   │   ├── features/             # Feature modules
│   │   │   │   ├── auth/             # Authentication feature
│   │   │   │   │   ├── controller.js
│   │   │   │   │   ├── routes.js
│   │   │   │   │   ├── service.js
│   │   │   │   │   └── types.js
│   │   │   │   ├── chat/             # Chat feature
│   │   │   │   ├── projects/         # Project management
│   │   │   │   ├── tutorials/        # Tutorial search & management
│   │   │   │   ├── profile/          # User profile
│   │   │   │   └── upload/           # File uploads
│   │   │   ├── core/                 # Shared core utilities
│   │   │   │   ├── config/           # Passport, env, dotenv
│   │   │   │   ├── middleware/       # Auth, error handling
│   │   │   │   └── utils/            # Helper functions
│   │   │   └── server.js             # Express app entry
│   │   ├── database/                 # Database migrations & seeds
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── setup.sql
│   │   └── package.json
│   │
│   └── web/                          # Frontend (Next.js + React)
│       ├── src/
│       │   ├── app/                  # Next.js app directory
│       │   ├── features/             # Feature modules
│       │   │   ├── auth/             # Auth UI & logic
│       │   │   │   ├── pages/
│       │   │   │   ├── components/
│       │   │   │   ├── hooks/
│       │   │   │   └── store.ts
│       │   │   ├── chat/             # Chat interface
│       │   │   ├── projects/         # Projects UI
│       │   │   ├── tutorials/        # Tutorials UI
│       │   │   ├── profile/          # Profile UI
│       │   │   └── dashboard/        # Dashboard landing
│       │   ├── shared/               # Shared utilities
│       │   │   ├── components/       # Global UI components
│       │   │   │   ├── ui/           # Primitive components (Button, Input, etc.)
│       │   │   │   ├── layout/       # Layout components (Sidebar, Header, etc.)
│       │   │   │   ├── common/       # Common feature components
│       │   │   │   └── README.md
│       │   │   ├── hooks/            # Global custom hooks
│       │   │   ├── utils/            # Helper functions
│       │   │   └── styles/           # Global styles & themes
│       │   ├── store/                # Global Zustand stores
│       │   │   ├── auth.ts
│       │   │   ├── chat.ts
│       │   │   ├── projects.ts
│       │   │   └── ui.ts
│       │   └── lib/                  # External integrations
│       │       ├── api.ts
│       │       ├── supabase.ts
│       │       └── helpers.ts
│       └── package.json
│
├── docs/
│   ├── architecture/         # Architecture docs
│   │   ├── STRUCTURE.md      # This file
│   │   ├── FEATURE_GUIDE.md  # How to add new features
│   │   └── API_SPEC.md       # API specification
│   ├── guides/               # Setup & deployment guides
│   │   ├── SETUP.md
│   │   ├── DEPLOYMENT.md
│   │   └── CONTRIBUTING.md
│   └── README.md
│
├── package.json              # Root workspace config (yarn workspaces)
└── README.md
```

---

## 🎯 Key Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Organization** | Controllers/Services mixed | Feature modules (self-contained) |
| **Scalability** | Hard to add new features | Easy to add new features |
| **Collaboration** | Developers step on toes | Clear feature ownership |
| **Testing** | Mixed concerns | Feature-specific tests |
| **Maintenance** | Global state mess | Modular stores per feature |

---

## 📦 Feature Module Structure

Each feature follows this pattern:

### Backend Feature (`packages/api/src/features/[feature]/`)
```
auth/
├── controller.js        # Request handlers
├── routes.js           # Route definitions
├── service.js          # Business logic
├── types.js            # TypeScript types (if using TS)
├── index.js            # Export point
└── README.md           # Feature documentation
```

### Frontend Feature (`packages/web/src/features/[feature]/`)
```
chat/
├── pages/              # Page components
├── components/         # Feature-specific components
├── hooks/              # Feature-specific hooks
├── store.ts            # Zustand store for this feature
├── types.ts            # TypeScript types
├── index.ts            # Export point
└── README.md           # Feature documentation
```

---

## 🔄 Data Flow

```
User Action → React Component
     ↓
Feature Hook / Store
     ↓
API Client (lib/api.ts)
     ↓
Backend Route (feature/routes.js)
     ↓
Controller (feature/controller.js)
     ↓
Service (feature/service.js) - Business Logic
     ↓
Supabase / Database
```

---

## 🚀 Getting Started

### Adding a New Feature

1. **Create directories** in both `packages/api/src/features/` and `packages/web/src/features/`
2. **Backend**: Create `controller.js`, `routes.js`, `service.js`
3. **Frontend**: Create `components/`, `pages/`, `hooks/`, `store.ts`
4. **Register** routes in main `server.js`
5. **Document** in feature README

See [FEATURE_GUIDE.md](./FEATURE_GUIDE.md) for detailed examples.

---

## 🤝 Collaboration

- **Backend Developer**: Works on `packages/api/src/features/[feature]/`
- **Frontend Developer**: Works on `packages/web/src/features/[feature]/`
- **Full-Stack Developer**: Owns both sides of a feature
- **Shared Components**: In `packages/web/src/shared/` (coordinate before changes)

---

## 📚 Documentation

- [API Specification](./API_SPEC.md)
- [Feature Guide](./FEATURE_GUIDE.md)
- [Setup Guide](../guides/SETUP.md)
- [Deployment Guide](../guides/DEPLOYMENT.md)
