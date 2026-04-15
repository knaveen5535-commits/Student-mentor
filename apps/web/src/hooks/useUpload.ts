'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useUserStore } from '../store/userStore';

export type UploadedFile = {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
};

export function useUpload() {
  const profile = useUserStore((s) => s.profile);
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    if (!profile?.email) throw new Error('Not logged in');
    const form = new FormData();
    form.append('file', file);

    setLoading(true);
    try {
      const data = await apiFetch<{ file: UploadedFile }>(`/uploads`, {
        method: 'POST',
        userEmail: profile.email,
        body: form
      });
      return data.file;
    } finally {
      setLoading(false);
    }
  }

  return { upload, loading };
}
