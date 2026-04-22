'use client';

import { useParams } from 'next/navigation';
import { ChatSidebar } from '../../../../components/chat/ChatSidebar';
import { ChatInput } from '../../../../components/chat/ChatInput';
import { ChatMessage } from '../../../../components/chat/ChatMessage';
import { useChat } from '../../../../hooks/useChat';
import { useChatStore } from '../../../../store/chatStore';

const SUGGESTED_PROMPTS = [
  { icon: '📚', text: 'Explain machine learning basics', label: 'Learn ML' },
  { icon: '💡', text: 'Help me brainstorm project ideas', label: 'Brainstorm' },
  { icon: '🐛', text: 'Debug my Python code', label: 'Debug Code' },
  { icon: '✍️', text: 'Write a technical blog post', label: 'Write Content' },
];

export default function ChatThreadPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;

  const thread = useChatStore((s) => s.threads.find((t) => t.id === chatId));
  const { sendMessage, loading } = useChat(chatId);

  if (!thread) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          background: 'rgba(22, 24, 31, 0.4)',
          backdropFilter: 'blur(40px) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.2)',
          color: 'rgba(240,242,255,0.4)',
          fontSize: 15,
        }}
      >
        Chat not found.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        height: '100%',
        width: '100%',
        alignItems: 'stretch',
        animation: 'fadeIn 0.3s ease-out',
        minHeight: 0,
      }}
    >
      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          gap: 0,
          minWidth: 0,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'transparent',
          backdropFilter: 'blur(40px) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(22, 24, 31, 0.4)',
            backdropFilter: 'blur(30px) brightness(1.1)',
            WebkitBackdropFilter: 'blur(30px) brightness(1.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: 'rgba(240,242,255,0.95)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {thread.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.35)' }}>
              AI Mentor · Ask anything
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 999,
              background: loading
                ? 'rgba(245,158,11,0.1)'
                : 'rgba(16,185,129,0.1)',
              border: `1px solid ${loading ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.2)'}`,
              fontSize: 12,
              fontWeight: 600,
              color: loading ? 'rgba(252,211,77,0.9)' : 'rgba(52,211,153,0.9)',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: loading ? '#f59e0b' : '#10b981',
                boxShadow: `0 0 6px ${loading ? '#f59e0b' : '#10b981'}`,
                display: 'inline-block',
                animation: loading ? 'pulse-glow 1s ease-in-out infinite' : 'none',
              }}
            />
            {loading ? 'Thinking...' : 'Ready'}
          </div>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {thread.messages.length === 0 ? (
            /* Empty state */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 32,
                minHeight: 300,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 24,
                    marginBottom: 16,
                    animation: 'float 4s ease-in-out infinite',
                    display: 'inline-block',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(99,102,241,0.5)',
                    border: '2px solid rgba(165,180,252,0.4)',
                  }}
                >
                  <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'rgba(240,242,255,0.9)',
                    marginBottom: 8,
                  }}
                >
                  How can I help you today?
                </h2>
                <p style={{ fontSize: 14, color: 'rgba(240,242,255,0.4)', maxWidth: 360 }}>
                  I'm your AI learning companion. Ask me anything — code, concepts, projects, or ideas.
                </p>
              </div>

              {/* Suggested prompts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                  width: '100%',
                  maxWidth: 500,
                }}
              >
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p.text).catch(console.error)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'rgba(99,102,241,0.12)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      animation: `fadeIn 0.4s ${i * 0.1}s ease-out both`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(99,102,241,0.22)';
                      el.style.borderColor = 'rgba(99,102,241,0.5)';
                      el.style.transform = 'translateY(-2px)';
                      el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 20px rgba(99,102,241,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(99,102,241,0.12)';
                      el.style.borderColor = 'rgba(99,102,241,0.25)';
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08)';
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', marginBottom: 2 }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(240,242,255,0.5)', lineHeight: 1.3 }}>
                        {p.text}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            thread.messages.map((m) => <ChatMessage key={m.id} msg={m} />)
          )}

          {/* Typing indicator */}
          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(22,24,31,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                width: 'fit-content',
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <span
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'rgba(99,102,241,0.7)',
                      display: 'inline-block',
                      animation: `typing-blink 1.2s ${delay}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'rgba(240,242,255,0.45)' }}>
                AI is thinking...
              </span>
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: '12px 16px 16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(14,15,20,0.7)',
            flexShrink: 0,
          }}
        >
          <ChatInput
            disabled={loading}
            onSend={async (text) => { await sendMessage(text); }}
          />
        </div>
      </div>
    </div>
  );
}
