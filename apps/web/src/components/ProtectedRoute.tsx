'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';

/**
 * ProtectedRoute Component
 * Uses the localStorage-based userStore (not Supabase) so it works
 * even when Supabase credentials are not configured.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useUserStore((s) => s.hydrated);
  const loggedIn = useUserStore((s) => s.loggedIn);

  useEffect(() => {
    if (hydrated && !loggedIn) {
      router.replace('/login');
    }
  }, [hydrated, loggedIn, router]);

  // Show loading screen while hydrating from localStorage
  if (!hydrated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0b0f',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Glow ring spinner */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: '3px solid rgba(99,102,241,0.15)',
            borderTop: '3px solid #6366f1',
            animation: 'spin 0.8s linear infinite',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          }}
        />
        <p
          style={{
            color: 'rgba(240,242,255,0.5)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          Loading workspace...
        </p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in — redirect handled by useEffect above
  if (!loggedIn) return null;

  return <>{children}</>;
}
