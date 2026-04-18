'use client';

import { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';

export function useChat(threadId: string) {
  const profile = useUserStore((s) => s.profile);
  const addMessage = useChatStore((s) => s.addMessage);
  const setTitleFromFirstMessage = useChatStore((s) => s.setTitleFromFirstMessage);
  const updateThreadId = useChatStore((s) => s.updateThreadId);
  const [loading, setLoading] = useState(false);

  async function sendMessage(content: string) {
    if (!profile?.email) throw new Error('Not logged in');

    addMessage(threadId, { role: 'user', content });
    setTitleFromFirstMessage(threadId);

    setLoading(true);
    try {
      const thread = useChatStore.getState().threads.find((t) => t.id === threadId);
      const messages = (thread?.messages || []).map((m) => ({ role: m.role, content: m.content }));

      const data = await apiFetch<{ message: { role: 'assistant'; content: string }; threadId?: string }>(`/chat`, {
        method: 'POST',
        userEmail: profile.email,
        body: { messages, threadId, message: content }
      });

      console.log('Chat API response:', data);

      addMessage(threadId, { role: 'assistant', content: data.message.content });

      // If backend returned a different threadId, update the store
      if (data.threadId && data.threadId !== threadId) {
        updateThreadId(threadId, data.threadId);
      }
    } catch (err) {
      console.error('Chat send failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { sendMessage, loading };
}
