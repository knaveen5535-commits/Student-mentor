# Contributing Guide

## Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/[your-fork]/mentor.git
   cd mentor
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Setup Environment**
   ```bash
   cp packages/api/.env.example packages/api/.env
   cp packages/web/.env.example packages/web/.env.local
   ```

4. **Start Development**
   ```bash
   yarn run dev:api      # Backend on :5000
   yarn run dev:web      # Frontend on :3000
   ```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/add-user-notifications
```

### 2. Make Changes

**Backend:**
- Work in `packages/api/src/features/[feature]/`
- Update service/controller/routes
- Add tests in `__tests__/`

**Frontend:**
- Work in `packages/web/src/features/[feature]/`
- Create components/pages
- Update Zustand store
- Add tests

### 3. Follow Architecture

**Backend:**
```
features/[feature]/
├── controller.js    # Express handlers
├── service.js       # Business logic
├── routes.js        # Route definitions
├── types.js         # TypeScript types
└── index.js         # Exports
```

**Frontend:**
```
features/[feature]/
├── pages/           # Page components
├── components/      # Feature components
├── hooks/           # Custom hooks
├── store.ts         # Zustand store
├── types.ts         # Types
└── index.ts         # Exports
```

### 4. Testing

```bash
# Backend tests
yarn run test:api

# Frontend tests
yarn run test:web

# All tests
yarn run test
```

### 5. Linting & Formatting

```bash
# Check lint
yarn run lint

# Fix auto-fixable issues
yarn run lint:fix

# Format with Prettier
yarn run format
```

### 6. Commit Changes

```bash
# Follow conventional commits
git commit -m "feat(chat): add message reactions

- Add reaction picker to messages
- Store reactions in database
- Real-time reaction updates
"
```

## Code Standards

### TypeScript
- Use strict mode
- Define all types
- No `any` types
- Use interfaces for objects

### React Components
- Functional components only
- Use hooks
- Memoize expensive computations
- Proper prop types

### Express Routes
- Use middleware for auth/validation
- Consistent error handling
- Document with JSDoc
- Return consistent response format

### State Management (Zustand)
- Keep stores feature-focused
- Use selectors for performance
- Document actions
- Avoid nested objects when possible

## Pull Request Process

1. **Create PR** with clear title and description
2. **Link Issues** - Link related issues
3. **Tests Pass** - All tests must pass
4. **Code Review** - Wait for maintainer review
5. **Address Feedback** - Make requested changes
6. **Merge** - PR will be merged

### PR Template
```markdown
## Description
Brief description of changes

## Type
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Docs update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing done

## Checklist
- [ ] Docs updated
- [ ] Tests pass
- [ ] No console errors
```

## Adding New Features

See [FEATURE_GUIDE.md](./FEATURE_GUIDE.md) for step-by-step guide.

Quick summary:
1. Create `features/[feature]/` in both API and Web
2. Add controller/service/routes (backend)
3. Add components/pages/store (frontend)
4. Register routes in main server
5. Test thoroughly
6. Document in README

## Common Tasks

### Add API Endpoint
1. Create/update route in `features/[feature]/routes.js`
2. Add handler in `features/[feature]/controller.js`
3. Add logic in `features/[feature]/service.js`
4. Test with API client

### Add Frontend Page
1. Create component in `features/[feature]/pages/`
2. Add route in Next.js routing
3. Create Zustand store if needed
4. Add components in `features/[feature]/components/`

### Add Shared Component
1. Create in `shared/components/ui/` or `shared/components/layout/`
2. Export from `shared/components/index.ts`
3. Document in `shared/components/README.md`
4. Add CSS module with styles

### Add Database Table
1. Create migration file
2. Add SQL in `packages/api/database/migrations/`
3. Run migration: `yarn run migrate:up`
4. Update Supabase service

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_KEY=...
OPENROUTER_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_KEY=...
```

## Debugging

### Backend
```bash
# Start with debugging
DEBUG=mentor:* yarn run dev:api

# VS Code launch config
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/packages/api/src/server.js"
}
```

### Frontend
```bash
# VS Code debugging
# Use Chrome DevTools for frontend debugging
```

## Documentation

- Update READMEs when adding features
- Document complex logic with comments
- Update CHANGELOG.md for releases
- Keep API docs in sync

## Code Review Checklist

- [ ] Follows project structure
- [ ] No console.log() statements
- [ ] Proper error handling
- [ ] Tests included and passing
- [ ] No TypeScript errors
- [ ] Documented (JSDoc, README)
- [ ] No sensitive data in code
- [ ] Performance considered

## Support

- 📖 Check docs in `docs/`
- 💬 GitHub Discussions
- 🐛 GitHub Issues
- 📧 Email maintainers

---

Thank you for contributing! 🎉
