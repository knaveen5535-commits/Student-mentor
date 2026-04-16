'use client';

import { useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AppShell } from '../../components/layout/AppShell';
import { useUserStore } from '../../store/userStore';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useUserStore.getState().hydrate();
  }, []);

  return (
    <ProtectedRoute>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.2,
          pointerEvents: 'none',
        }}
      >
        <source src="/assets/workspace.mp4" type="video/mp4" />
      </video>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
