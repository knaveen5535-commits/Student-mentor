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
    } catch (err: any) {
      console.error('Chat send failed:', err);

      // Detect 503 error
      const is503 = err?.message?.includes('503') || err?.status === 503 || err?.message?.includes('high demand') || err?.message?.includes('busy');
      const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');

      let errorMessage = err?.message || 'An error occurred. Please try again.';
      if (is503) errorMessage = 'Server busy, please try again';
      if (is429) errorMessage = 'AI Model quota exceeded. Please wait a minute before sending more messages.';

      // Show user friendly message (using alert as a simple toast alternative)
      if (typeof window !== 'undefined') {
        alert(errorMessage);
      }

      // Do not re-throw error to prevent Unhandled Promise Rejection UI crash
    } finally {
      setLoading(false);
    }
  }

  return { sendMessage, loading };
}
