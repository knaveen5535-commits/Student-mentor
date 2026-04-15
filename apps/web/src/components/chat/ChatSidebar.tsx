'use client';

import Link from 'next/link';
import { useChatStore } from '../../store/chatStore';

export function ChatSidebar({ activeId }: { activeId?: string }) {
  const threads = useChatStore((s) => s.threads);

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(16,18,25,0.8)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        height: '100%',
        animation: 'slideInLeft 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(22,24,31,0.6)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: 'rgba(240,242,255,0.9)',
            }}
          >
            Chats
          </span>
          {threads.length > 0 && (
            <span
              style={{
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 999,
              }}
            >
              {threads.length}
            </span>
          )}
        </div>

        <Link
          href="/chat"
          id="chat-sidebar-new"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
          title="New chat"
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'scale(1.1) rotate(90deg)';
            el.style.boxShadow = '0 6px 18px rgba(99,102,241,0.5)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'scale(1) rotate(0deg)';
            el.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
          }}
        >
          +
        </Link>
      </div>

      {/* Chat list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {threads.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 24,
              textAlign: 'center',
              flex: 1,
            }}
          >
            <div style={{ fontSize: 32, opacity: 0.4 }}>💬</div>
            <div style={{ fontSize: 13, color: 'rgba(240,242,255,0.35)', lineHeight: 1.5 }}>
              No conversations yet.
              <br />
              <Link
                href="/chat"
                style={{
                  color: '#818cf8',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; }}
              >
                Start one →
              </Link>
            </div>
          </div>
        ) : (
          threads.map((t, idx) => {
            const active = activeId === t.id;
            return (
              <Link
                key={t.id}
                href={`/chat/${t.id}`}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: active
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12))'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(99,102,241,0.25)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#c4b5fd' : 'rgba(240,242,255,0.6)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                  animation: `fadeIn 0.3s ${idx * 0.05}s ease-out both`,
                }}
                title={t.title}
                onMouseEnter={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.04)';
                    el.style.color = 'rgba(240,242,255,0.85)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'transparent';
                    el.style.color = 'rgba(240,242,255,0.6)';
                  }
                }}
              >
                {/* Active indicator */}
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '25%',
                      bottom: '25%',
                      width: 2.5,
                      background: 'linear-gradient(180deg, #6366f1, #a78bfa)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span style={{ fontSize: 14, flexShrink: 0 }}>
                  {idx === 0 ? '✨' : '💭'}
                </span>
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {t.title}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
