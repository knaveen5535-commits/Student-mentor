import { create } from 'zustand';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
};

type ChatState = {
  threads: ChatThread[];
  createThread: () => ChatThread;
  addMessage: (threadId: string, msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  setTitleFromFirstMessage: (threadId: string) => void;
  updateThreadId: (oldId: string, newId: string) => void;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: [],

  createThread: () => {
    const thread: ChatThread = {
      id: uid(),
      title: 'New chat',
      messages: [],
      createdAt: Date.now()
    };
    set((s) => ({ threads: [thread, ...s.threads] }));
    return thread;
  },

  addMessage: (threadId, msg) => {
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: uid(), role: msg.role, content: msg.content, createdAt: Date.now() }
              ]
            }
          : t
      )
    }));
  },

  setTitleFromFirstMessage: (threadId) => {
    const thread = get().threads.find((t) => t.id === threadId);
    if (!thread || thread.title !== 'New chat') return;
    const firstUser = thread.messages.find((m) => m.role === 'user');
    if (!firstUser) return;
    const title = firstUser.content.slice(0, 40) || 'Chat';
    set((s) => ({
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, title } : t))
    }));
  },

  updateThreadId: (oldId, newId) => {
    set((s) => ({
      threads: s.threads.map((t) => (t.id === oldId ? { ...t, id: newId } : t))
    }));
  }
}));
