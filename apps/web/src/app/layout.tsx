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
      <body>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: 0.15,
            filter: 'blur(8px)',
          }}
        >
          <source src="/assets/workspace.mp4" type="video/mp4" />
        </video>
        {children}
      </body>
    </html>
  );
}
