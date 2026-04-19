# Shared Utilities & Helpers

Global utility functions used across the application.

## Available Utilities

### Date Helpers
- `formatDate(date)` - Format date to readable string
- `formatTime(date)` - Format time
- `formatDateTime(date)` - Format date and time
- `isToday(date)` - Check if date is today
- `daysAgo(date)` - Get days ago string

### String Helpers
- `truncate(str, length)` - Truncate string with ellipsis
- `capitalize(str)` - Capitalize first letter
- `slugify(str)` - Convert to URL-friendly slug
- `toTitleCase(str)` - Convert to title case

### Array Helpers
- `uniq(arr)` - Get unique values
- `chunk(arr, size)` - Split array into chunks
- `flatten(arr)` - Flatten nested arrays

### Object Helpers
- `pick(obj, keys)` - Pick specific keys
- `omit(obj, keys)` - Omit specific keys
- `merge(obj1, obj2)` - Merge objects

### Validation
- `isEmail(str)` - Validate email
- `isUrl(str)` - Validate URL
- `isPhoneNumber(str)` - Validate phone number

## Usage

```typescript
import { formatDate, capitalize, isEmail } from '@/shared/utils';

const date = formatDate(new Date());
const name = capitalize('john');
const valid = isEmail('test@example.com');
```
