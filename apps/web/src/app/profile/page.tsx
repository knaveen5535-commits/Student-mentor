'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useUserStore } from '../../store/userStore';

export default function ProfilePage() {
  const hydrate = useUserStore((s) => s.hydrate);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const profile = useUserStore((s) => s.profile);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function load() {
      if (!profile?.email) return;
      const data = await apiFetch<{ count: number }>(`/projects/count`, { userEmail: profile.email });
      setCount(data.count);
    }
    if (loggedIn) load();
  }, [loggedIn, profile?.email]);

  if (!loggedIn) {
    return (
      <div className="container">
        <h1>Profile</h1>
        <div className="card">Please login first.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="card" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div><strong>Name:</strong> {profile?.name}</div>
          <div><strong>Email:</strong> {profile?.email}</div>
          <div><strong>Projects created:</strong> {count}</div>
        </div>
      </div>
    </div>
  );
}
