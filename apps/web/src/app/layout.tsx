import type { Metadata } from 'next';
import '../styles/globals.css';

// Some Node environments expose a non-standard/broken `globalThis.localStorage`.
// If present, it can break SSR when libraries feature-detect `localStorage`.
// This shim makes SSR safe without affecting the browser.
if (typeof window === 'undefined') {
  const ls: any = (globalThis as any).localStorage;
  if (ls && typeof ls.getItem !== 'function') {
    (globalThis as any).localStorage = {
      getItem() {
        return null;
      },
      setItem() {},
      removeItem() {},
      clear() {},
      key() {
        return null;
      },
      length: 0
    };
  }
}

export const metadata: Metadata = {
  title: 'AI Mentor — Your Intelligent Learning Workspace',
  description: 'AI-powered mentor platform for learning, coding, and project guidance.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
