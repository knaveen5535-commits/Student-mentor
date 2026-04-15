'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '../../../store/chatStore';

export default function ChatIndexPage() {
  const router = useRouter();
  const createThread = useChatStore((s) => s.createThread);

  useEffect(() => {
    const thread = createThread();
    router.replace(`/chat/${thread.id}`);
  }, [createThread, router]);

  return <div>Creating chat...</div>;
}
