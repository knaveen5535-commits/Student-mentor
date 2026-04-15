'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { useProjectStore, type Project } from '../store/projectStore';

export function useProjects() {
  const profile = useUserStore((s) => s.profile);
  const projects = useProjectStore((s) => s.projects);
  const setProjects = useProjectStore((s) => s.setProjects);
  const [loading, setLoading] = useState(false);

  async function refresh(query: string = '') {
    if (!profile?.email) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ projects: Project[] }>(`/projects?q=${encodeURIComponent(query)}`, {
        userEmail: profile.email
      });
      setProjects(data.projects);
    } finally {
      setLoading(false);
    }
  }

  async function create(title: string, information: string) {
    if (!profile?.email) throw new Error('Not logged in');
    setLoading(true);
    try {
      await apiFetch<{ project: Project }>(`/projects`, {
        method: 'POST',
        userEmail: profile.email,
        body: { title, information }
      });
      await refresh('');
    } finally {
      setLoading(false);
    }
  }

  async function history() {
    if (!profile?.email) return [];
    const data = await apiFetch<{ history: Array<{ id: string; query: string; created_at: string }> }>(
      `/projects/history`,
      { userEmail: profile.email }
    );
    return data.history;
  }

  return { projects, loading, refresh, create, history };
}
