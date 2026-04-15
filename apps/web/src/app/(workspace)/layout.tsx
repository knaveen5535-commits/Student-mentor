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
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
