# Backend Structure Overview

```
packages/api/
├── src/
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   │   ├── controller.js
│   │   │   ├── routes.js
│   │   │   ├── service.js
│   │   │   ├── types.js
│   │   │   ├── index.js
│   │   │   └── README.md
│   │   ├── chat/
│   │   ├── projects/
│   │   ├── tutorials/
│   │   ├── profile/
│   │   ├── upload/
│   │   └── README.md
│   │
│   ├── core/                 # Shared core
│   │   ├── config/           # Configurations
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   ├── types.js          # Global types
│   │   ├── index.js
│   │   └── README.md
│   │
│   ├── server.js             # Express app entry point
│   └── constants.js          # Global constants
│
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Seed data
│   └── setup.sql             # Initial schema
│
├── package.json
└── README.md
```

## Getting Started

1. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Setup Database**
   ```bash
   yarn run setup-db
   ```

4. **Start Development**
   ```bash
   yarn run dev
   ```

## Feature Development

Each feature is self-contained. To add a new feature:

1. Create folder in `src/features/[feature-name]`
2. Add `controller.js`, `routes.js`, `service.js`
3. Register routes in `server.js`
4. Add database migrations if needed

See [FEATURE_GUIDE.md](../../docs/architecture/FEATURE_GUIDE.md) for detailed example.

## API Routes

All routes are prefixed with `/api/`:

- `/api/auth/*` - Authentication endpoints
- `/api/chat/*` - Chat endpoints
- `/api/projects/*` - Project endpoints
- `/api/tutorials/*` - Tutorial endpoints
- `/api/profile/*` - Profile endpoints
- `/api/upload/*` - Upload endpoints

See [API_SPEC.md](../../docs/architecture/API_SPEC.md) for full API documentation.
