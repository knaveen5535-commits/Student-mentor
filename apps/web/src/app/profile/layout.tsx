'use client';

import { useAuthGuard } from '../../hooks/useAuth';
import { AppShell } from '../../components/layout/AppShell';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return <AppShell>{children}</AppShell>;
}
