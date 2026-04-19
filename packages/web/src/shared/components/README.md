# Shared Components Library

Global UI components used across all features. Organized by category.

## Structure

```
components/
├── ui/              # Primitive/base components
├── layout/          # Layout components
└── common/          # Common feature components
```

## UI Components (Primitives)

Base components that follow design system standards.

- `Button` - Primary, secondary, danger variants
- `Input` - Text, email, password, number inputs
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `Radio` - Radio input
- `Modal` - Modal dialog
- `Card` - Card container
- `Badge` - Badge/tag component
- `Alert` - Alert notifications
- `Loading` - Loading spinner
- `Avatar` - User avatar

## Layout Components

Page layout and structure.

- `Sidebar` - Left navigation sidebar
- `Header` - Top header/navbar
- `Footer` - Page footer
- `Container` - Content container with max-width
- `Grid` - Responsive grid layout

## Common Components

Feature-agnostic common components.

- `ProtectedRoute` - Route guard for auth
- `ErrorBoundary` - Error boundary wrapper
- `Loader` - Full page loader
- `NotFound` - 404 page
- `Navigation` - Main navigation

## Usage

```typescript
import { Button, Input, Card } from '@/shared/components/ui';
import { Sidebar, Header } from '@/shared/components/layout';
import { ProtectedRoute } from '@/shared/components/common';
```

## Design Tokens

All components use consistent design tokens:
- Colors: Primary, Secondary, Danger, Success, Warning
- Typography: Heading 1-6, Body, Small
- Spacing: 4px, 8px, 12px, 16px, 24px, 32px
- Shadows: sm, md, lg
- Radius: xs, sm, md, lg

## Adding New Components

1. Create component file in appropriate category
2. Export from `index.ts` in that category
3. Add to main `index.ts` export
4. Document usage in README
5. Add to Storybook (if using)
