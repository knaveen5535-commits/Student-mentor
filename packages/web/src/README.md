# Frontend Structure Overview

```
packages/web/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   ├── (workspace)/
│   │   └── ...
│   │
│   ├── features/             # Feature modules (self-contained)
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── chat/
│   │   ├── projects/
│   │   ├── tutorials/
│   │   ├── profile/
│   │   ├── dashboard/
│   │   └── README.md
│   │
│   ├── shared/               # Shared across features
│   │   ├── components/       # Global components
│   │   │   ├── ui/           # Primitive components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── common/       # Common components
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   ├── hooks/            # Global custom hooks
│   │   ├── utils/            # Helper functions
│   │   └── styles/           # Global styles & themes
│   │
│   ├── store/                # Global Zustand stores
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── projects.ts
│   │   ├── ui.ts
│   │   └── index.ts
│   │
│   ├── lib/                  # External integrations
│   │   ├── api.ts
│   │   ├── supabase.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   └── styles/               # Global styles
│       └── globals.css
│
├── public/
├── package.json
└── tsconfig.json
```

## Getting Started

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development**
   ```bash
   yarn run dev
   ```

4. **Build for Production**
   ```bash
   yarn run build
   yarn run start
   ```

## Feature Development

Each feature is self-contained with:
- Pages (routes)
- Components (UI)
- Hooks (custom hooks)
- Store (state management)
- Types (TypeScript interfaces)

Example:
```
features/chat/
├── pages/
│   └── ChatPage.tsx       # Main chat page
├── components/
│   ├── ChatInput.tsx      # Chat input
│   └── MessageList.tsx    # Message display
├── hooks/
│   └── useChat.ts         # Custom hook
├── store.ts               # Zustand store
├── types.ts               # Types
├── index.ts               # Exports
└── README.md
```

See [FEATURE_GUIDE.md](../../docs/architecture/FEATURE_GUIDE.md) for detailed example.

## Component Hierarchy

```
App (layout.tsx)
├── Header
├── Sidebar
└── Main Content
    ├── [Feature] Page
    │   └── [Feature] Components
    └── Shared Components (ui/*, layout/*)
```

## State Management

Using **Zustand** for state:
- `store/auth.ts` - Authentication state
- `store/chat.ts` - Chat state
- `store/projects.ts` - Projects state
- `store/ui.ts` - UI state (modals, themes, etc.)

Each feature can also have a local `store.ts` for feature-specific state.

## Styling

- **Global Styles**: `styles/globals.css`
- **Component Styles**: CSS Modules (`.module.css`)
- **Design System**: Shared components in `shared/components/`

All components support:
- Variants (primary, secondary, danger, etc.)
- Sizes (sm, md, lg)
- Responsive design
- Dark mode compatibility

## Hooks

Global hooks in `shared/hooks/`:
- `useAuth` - Authentication context
- `useChat` - Chat operations
- `useProjects` - Project operations
- `useSupabaseAuth` - Supabase auth

Feature-specific hooks in `features/[feature]/hooks/`
