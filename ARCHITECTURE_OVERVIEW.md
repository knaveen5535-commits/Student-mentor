# New Workspace Architecture

## 🎯 Overview

AI Mentor has been restructured with a **modern, interactive, feature-based architecture** designed for scalability and team collaboration.

### Key Improvements

1. **Feature-Based Organization** - Each feature is self-contained (auth, chat, projects, tutorials, profile, upload)
2. **Clear Separation** - Shared utilities in `core/` and `shared/`, features isolated
3. **Interactive UI Components** - New component library with modern design system
4. **Team Collaboration** - Clear ownership and minimal conflicts
5. **Developer Experience** - Find everything in one place per feature

---

## 📚 Documentation

**Start here:**
- [RESTRUCTURING_COMPLETE.md](./RESTRUCTURING_COMPLETE.md) - Quick overview of changes
- [docs/architecture/STRUCTURE.md](./docs/architecture/STRUCTURE.md) - Complete structure guide
- [docs/architecture/FEATURE_GUIDE.md](./docs/architecture/FEATURE_GUIDE.md) - How to add features
- [docs/architecture/MIGRATION_GUIDE.md](./docs/architecture/MIGRATION_GUIDE.md) - Old → New mapping
- [docs/guides/CONTRIBUTING.md](./docs/guides/CONTRIBUTING.md) - Development workflow

---

## 🏗️ Project Structure

```
mentor/
├── packages/
│   ├── api/                       # Backend (Node.js + Express)
│   │   ├── src/
│   │   │   ├── features/          # Feature modules
│   │   │   │   ├── auth/          # Authentication
│   │   │   │   ├── chat/          # AI Chat
│   │   │   │   ├── projects/      # Project management
│   │   │   │   ├── tutorials/     # Tutorial search
│   │   │   │   ├── profile/       # User profile
│   │   │   │   ├── upload/        # File uploads
│   │   │   │   └── README.md
│   │   │   ├── core/              # Shared core
│   │   │   │   ├── config/        # Passport, env setup
│   │   │   │   ├── middleware/    # Auth, errors
│   │   │   │   ├── utils/         # Helpers
│   │   │   │   └── README.md
│   │   │   └── server.js          # Entry point
│   │   ├── database/              # Migrations & seeds
│   │   └── package.json
│   │
│   └── web/                       # Frontend (Next.js + React)
│       ├── src/
│       │   ├── app/               # Next.js routes
│       │   ├── features/          # Feature modules
│       │   │   ├── auth/          # Auth pages & components
│       │   │   ├── chat/          # Chat interface
│       │   │   ├── projects/      # Projects UI
│       │   │   ├── tutorials/     # Tutorials UI
│       │   │   ├── profile/       # Profile UI
│       │   │   ├── dashboard/     # Landing page
│       │   │   └── README.md
│       │   ├── shared/            # Global utilities
│       │   │   ├── components/    # Global components
│       │   │   │   ├── ui/        # Primitives
│       │   │   │   ├── layout/    # Layout
│       │   │   │   ├── common/    # Common
│       │   │   │   └── README.md
│       │   │   ├── hooks/         # Global hooks
│       │   │   ├── utils/         # Helpers
│       │   │   └── styles/        # Global styles
│       │   ├── store/             # Global Zustand stores
│       │   ├── lib/               # External integrations
│       │   └── styles/
│       └── package.json
│
├── docs/
│   ├── architecture/              # Architecture docs
│   │   ├── STRUCTURE.md           # Overview
│   │   ├── FEATURE_GUIDE.md       # Feature creation
│   │   ├── MIGRATION_GUIDE.md     # Migration from old structure
│   │   └── API_SPEC.md            # API documentation
│   │
│   └── guides/                    # Setup guides
│       ├── SETUP.md               # Getting started
│       ├── DEPLOYMENT.md          # Deployment
│       └── CONTRIBUTING.md        # Contribution guidelines
│
├── RESTRUCTURING_COMPLETE.md      # Changes summary
├── package.json                   # Root workspace config
└── README.md                      # Main README
```

---

## ✨ New Components

### UI Components (`shared/components/ui/`)
- 🎨 **Button** - Primary, secondary, danger, ghost variants
- 📝 **Input** - Enhanced with icons, error states, hints
- 🎴 **Card** - Default, glass, elevated variants
- 🏷️ **Badge** - Status indicators
- Plus: Modal, Alert, Loading, Avatar, etc.

### Layout Components (`shared/components/layout/`)
- 📌 **Sidebar** - Responsive navigation
- 🎯 **Header** - Sticky header with actions
- Plus: Footer, Container, Grid, etc.

### Design Features
- ✨ Gradient color scheme (purple/indigo)
- 📱 Fully responsive
- ♿ Accessible
- 🌙 Dark mode ready
- ⚡ Smooth animations

---

## 🚀 Quick Start

### Backend

```bash
cd packages/api

# Install dependencies
yarn install

# Setup environment
cp .env.example .env

# Setup database
yarn run setup-db

# Start development
yarn run dev
```

### Frontend

```bash
cd packages/web

# Install dependencies
yarn install

# Setup environment
cp .env.example .env.local

# Start development
yarn run dev
```

Access app at `http://localhost:3000`

---

## 📋 Feature Development

### Adding a New Feature

1. **Create directories** in both backend and frontend
2. **Backend**: Implement controller, service, routes
3. **Frontend**: Create pages, components, hooks, store
4. **Connect**: Register routes and integrate
5. **Test**: Ensure all features work
6. **Document**: Update feature README

**See [FEATURE_GUIDE.md](./docs/architecture/FEATURE_GUIDE.md) for detailed steps**

### Feature Structure

#### Backend
```
features/chat/
├── controller.js       # Request handlers
├── service.js          # Business logic
├── routes.js           # Route definitions
├── types.js            # TypeScript types
├── index.js            # Exports
└── README.md           # Docs
```

#### Frontend
```
features/chat/
├── pages/              # Page components
├── components/         # UI components
├── hooks/              # Custom hooks
├── store.ts            # Zustand store
├── types.ts            # Types
├── index.ts            # Exports
└── README.md           # Docs
```

---

## 🤝 Team Collaboration

### Backend Developer
- Works in `packages/api/src/features/`
- Implements business logic
- Manages database changes
- Documents API endpoints

### Frontend Developer
- Works in `packages/web/src/features/`
- Creates UI components
- Manages feature state
- Tests user interactions

### Full-Stack Developer
- Owns both sides of features
- Ensures API-UI consistency
- Handles end-to-end testing

### Shared Responsibility
- Maintain components in `shared/`
- Update core utilities
- Document common patterns
- Code review & quality

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [STRUCTURE.md](./docs/architecture/STRUCTURE.md) | Architecture overview |
| [FEATURE_GUIDE.md](./docs/architecture/FEATURE_GUIDE.md) | How to create features |
| [MIGRATION_GUIDE.md](./docs/architecture/MIGRATION_GUIDE.md) | Migrate old code |
| [CONTRIBUTING.md](./docs/guides/CONTRIBUTING.md) | Dev workflow |
| [SETUP.md](./docs/guides/SETUP.md) | Getting started |
| [API_SPEC.md](./docs/architecture/API_SPEC.md) | API reference |

---

## 🎯 Benefits

### Scalability
- ✅ Easy to add new features
- ✅ No touching unrelated code
- ✅ Clear module boundaries

### Collaboration
- ✅ Multiple developers can work simultaneously
- ✅ Clear feature ownership
- ✅ Minimal conflicts

### Maintainability
- ✅ Changes isolated to one feature
- ✅ Easy to find related code
- ✅ Simpler testing

### Developer Experience
- ✅ Everything for a feature in one place
- ✅ Clear conventions
- ✅ Modern tooling

---

## 🔧 Tech Stack

**Backend:**
- Node.js + Express
- Passport.js + Google OAuth
- PostgreSQL (Supabase)
- OpenRouter AI API

**Frontend:**
- Next.js 15.3
- React 19.1
- TypeScript
- Zustand (state)
- CSS Modules

**Infrastructure:**
- Supabase (database & auth)
- Yarn workspaces
- Modern development tools

---

## 📖 Getting Help

1. **Read Documentation** - Start with [RESTRUCTURING_COMPLETE.md](./RESTRUCTURING_COMPLETE.md)
2. **Check Feature Guide** - [FEATURE_GUIDE.md](./docs/architecture/FEATURE_GUIDE.md)
3. **Review Examples** - Each feature has README
4. **See Contributing** - [CONTRIBUTING.md](./docs/guides/CONTRIBUTING.md)

---

## ✅ What's Included

- ✅ Complete feature-based architecture
- ✅ Modern UI component library
- ✅ Comprehensive documentation
- ✅ Migration guide for existing code
- ✅ Development guidelines
- ✅ Contribution workflow
- ✅ TypeScript support
- ✅ Responsive design system

---

**Ready to build amazing features! 🚀**

Start by reading [RESTRUCTURING_COMPLETE.md](./RESTRUCTURING_COMPLETE.md)
